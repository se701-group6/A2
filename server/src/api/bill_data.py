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

class BillDataApi(object):
    def __init__(self, database):
        self.database = database

    @cherrypy.expose
    def get_bills(self):
        """Searches database for all bills
            does not modify database
            Check database structure doc
            
        JSON Arguments:
            None
        JSON Returns:
            bills -- list of bill JSONs
            message (optional) -- error message if applicable
        """
        
        bills = []
        error_msg = ""
        try:
            username = cherrypy.session["username"]
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
        except KeyError as e:
            error_msg = "User not logged in"
        except Exception as e:
            print(e)
            error_msg = "Unknown error occured"
        finally:
            response = {
                'bills' : bills,
                'message' : error_msg
            }
            return json.dumps(response)
