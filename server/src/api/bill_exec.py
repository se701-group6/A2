import cherrypy
import urllib.request
import json
import base64
import socket

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
        
        error_msg = ""
        success = True
        
        try:
            username = cherrypy.session["username"]
            success = self.database.add_bill(payer,username,title,total,outstanding_payments)
        except KeyError as e:
            error_msg = "User not logged in"
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