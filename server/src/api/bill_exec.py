import cherrypy
import urllib.request
import json
from db_manager import Payment

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

class BillExecApi(object):
    def __init__(self, database):
        self.database = database

    @cherrypy.expose
    def create_bill(self):
        """creates a bill and adds to 
            the database accordingly
        
        JSON Arguments:
            title -- user defined name of bill
            payer -- name of person who fronted bill
            total -- total bill amount
            outstanding_payments -- list of outstanding payments
                person -- name of payer
                amount -- amount outstanding
        JSON Returns:
            success -- bool success of fail
            message (optional) - error message if applicable
        """
        JSON_object = json.loads(cherrypy.request.body.read().decode('utf-8'))
        title = JSON_object.get("title")
        payer = JSON_object.get("payer")
        total = JSON_object.get("total")
        outstanding_payments = JSON_object.get("outstanding_payments")

        payment_objects = []
        for payment in outstanding_payments:
            payment_obj = Payment(*(payment['person'], payment['amount']), False, -1)
            payment_objects.append(payment_obj)

        error_msg = ""        
        success = False
        
        try:
            #Check login
            try:
                username = cherrypy.session["username"]
            except KeyError as e:
                raise InvalidDataException("login")

            #Bill has a title
            if ((len(title) < 1)):
                raise InvalidDataException("title")

            #Bill has a payer
            if ((len(payer) < 1)):
                raise InvalidDataException("payer")

            #Bill has a total greater than 0
            try: 
                float(total)
            except ValueError as e:
                raise InvalidDataException("total")

            if (float(total) <= 0):
                raise InvalidDataException("total")

            #Bill has someone who needs to pay their share
            if (len(payment_objects) < 1):
                raise InvalidDataException("split")
            
            success = self.database.add_bill(payer,username,title,total,payment_objects)
        except InvalidDataException as e:
            #add the appropriate message to return
            if(e.args[0]=="title"):
                error_msg = "Title required "
            elif(e.args[0]=="payer"):
                error_msg = "No payer for bill "
            elif(e.args[0]=="total"):
                error_msg = "Incorrect total, total must be greater than 0 "
            elif(e.args[0]=="split"):
                error_msg = "Cannot split a bill with one person "
            elif(e.args[0]=="login"):
                error_msg = "User not logged in"
            else:
                print(e)
                error_msg = "Unknown error occured"
            success = False
        except Exception as e:
            print(e)
            error_msg = "Unknown error occured"
            success = False
        finally:
            response = {
                'success' : success,
                'message' : error_msg
            }
            return json.dumps(response)

    @cherrypy.expose
    def del_bill(self):
        """Searches database for the bill
            deletes it if the username matches
            authorised user

        JSON Arguments:
            bill_id (Integer): Bill Identification number
        JSON Returns:
            message (Optional) -- error message if applicable
        """

        error_msg = ""
        JSON_object = json.loads(cherrypy.request.body.read().decode('utf-8'))
        bill_id = JSON_object.get("bill_id")

        try:
            username = cherrypy.session["username"]
            valid_user = self.database.check_if_user_owns_bill(username, bill_id)

            if (valid_user == True):
                self.database.delete_bill(bill_id)
            else:
                error_msg = "Bill does not exist or you are not authorised to delete this bill!"

        except Exception as e:
            print(e)
            error_msg = "Unknown error occured"
        finally:
            response = {
                'message': error_msg
            }
            return json.dumps(response)
