import cherrypy
import urllib.request
import json

"""
    Json receiving example:
        JSON_object = json.loads(cherrypy.request.body.read().decode('utf-8'))
        JSON_field = JSON_object.get("FIELD_NAME")
                
    Json sending example:
        #create json packet
        response = {
            'response': 'ok',
            }
        #send
        return json.dumps(response)
"""
class InvalidDataException(ValueError):
    pass

class BillDataApi(object):
    def __init__(self, database):
        self.database = database

    @cherrypy.expose
    #Specified defaults so it doesn't crash with the old front end
    def get_bills(self,sort_field="created time",sort_order="asc",is_paid="either",payer="",payee="",page_number=1):
        """Searches database for all bills
            does not modify database
            Check database structure doc
            
        JSON Arguments:
            sort_field -- The field this is sorted by. One of 'name', 'amount', 'created time'
            sort_order -- The sorting order either 'asc' or 'desc'
            is_paid -- Filter paid bills. One of 'paid', 'unpaid', 'either'
            payer -- Filter by the this person if they owe money
            payee -- filter by this person if they were owed money
            page_number -- The page number requested. Currently hardcoded to 5 per page,
                            can be adapted for flexible page sizes later.
        JSON Returns:
            bills -- list of bill JSONs
            message (optional) -- error message if applicable
        """
        page_size = 5
        bill_sort_fields=["amount","created_time","name"]

        bills = []
        error_msg = ""

        try:
            page_number = int(page_number)
            #Quick sanity check
            if(page_number < 0):
                raise InvalidDataException("page_number")

            #check login
            try:
                username = cherrypy.session["username"]
            except KeyError as e:
                raise InvalidDataException("login")

            bill_objects = self.database.get_bills_from_username(username)
            #converts internal object representation to appropriate json format
            for bill_obj in bill_objects:
                payment_objects = bill_obj.payments
                payments = []
                for payment_obj in payment_objects:
                    payment_dict = {
                        "payment_id" : payment_obj.payment_id,
                        "to" : bill_obj.payer,
                        "from" : payment_obj.payee_name,
                        "amount" : payment_obj.amount_owed,
                        "is_paid" : payment_obj.is_paid
                    }
                    payments.append(payment_dict)

                bill_dict = {
                    "bill_id" : bill_obj.bill_id,
                    "timestamp" : bill_obj.timestamp,
                    "title" : bill_obj.title,
                    "total" : bill_obj.total,
                    "payments" : payments
                }
                bills.append(bill_dict)
            #Check if list should be ascending or descending
            if(sort_order == "asc"):
                descending=False
            elif(sort_order == "desc"):
                descending=True
            else:
                #Invalid API call
                raise InvalidDataException("sort_order")

            #Sort list by listed sort_field
            sort=[]
            if(sort_field in bill_sort_fields):
                #These fields only require searching the bills dict

                #Translate the sort_field to the related dict key
                if(sort_field=="amount"):
                    field="total"
                elif(sort_field=="created_time"):
                    field="timestamp"
                elif (sort_field=="name"):
                    field="title"
                    #Due to how ascii would end up at the front of an a descending sort
                    #to make more intuitive sense the order is flipped for names
                    descending=not(descending)

                for i in bills:
                    if (len(sort) == 0 ):
                            sort.append(i)
                            continue
                    for j in range( 0,len(sort)+1 ):

                        if(j == len(sort)):
                            #reached the end of the list, add it to the end
                            sort.append(i)
                        else:
                            #When comparing strings we would like to ignore capitilisation so that
                            #the ascii values dont sort A,a,B to A,B,a
                            #however lower only exists on strings, otherwise it will throw an error
                            if(sort_field=="name"):
                                if( ( (i[field]).lower() > (sort[j][field]).lower() ) == descending):
                                    sort.insert(j,i)
                                    break
                            else:
                                if( ( (i[field]) > (sort[j][field]) ) == descending):
                                    sort.insert(j,i)
                                    break
            else:
                #Invalid API call
                raise InvalidDataException("sort_field")

            bills=sort

            #check for names in the payee and payer fields
            filter_payee=( len(payee) > 0 )
            filter_payer=( len(payer) > 0 )
            #Remove paid/unpaid bills if requested
            output=[]
            if(is_paid == "paid" or is_paid=="unpaid" or is_paid=="either"):
                for i in bills:
                    valid=True
                    valid_payee=False
                    valid_payer=False
                    for j in i["payments"]:
                        if( not( j["is_paid"] == (is_paid == "paid") ) and is_paid != "either"):
                            valid = False
                        if( (payee==j["to"]) and filter_payee):
                            valid_payee = True
                        if( (payer==j["from"]) and filter_payer):
                            valid_payer = True
                    if (valid and valid_payee == filter_payee and valid_payer == filter_payer):
                        output.append(i)
                bills=output
            else:
                #Invalid API call
                raise InvalidDataException("is_paid")


            #Check what page we are on and make sure to only return those
            if ( (page_number)*page_size-1 >= len(bills) ):
                bills = bills[(page_number-1)*page_size : len(bills) ]
            else:
                bills = bills[(page_number-1)*page_size : (page_number)*page_size]

        except InvalidDataException as e:
            #add the appropriate message to return
            if(e.args[0]=="page_number"):
                error_msg="Invalid page_number field. Value should be greater than or equal to 0"
            elif(e.args[0]=="login"):
                error_msg="User not logged in"
            elif(e.args[0]=="sort_order"):
                error_msg="Invalid sort_order field. Values should be 'asc' or 'desc' "
            elif(e.args[0]=="sort_field"):
                error_msg="Invalid sort_field field. Values should be 'name', 'amount' or 'created_time' "
            elif(e.args[0]=="is_paid"):
                error_msg="Invalid is_paid field. Values should be 'paid', 'unpaid' or 'either' "
            else:
                print(e)
                error_msg = "Unknown error occured"


        except Exception as e:
            print(e)
            error_msg = "Unknown error occured"
        finally:
            response = {
                'bills' : bills,
                'message' : error_msg
            }
            return json.dumps(response)
