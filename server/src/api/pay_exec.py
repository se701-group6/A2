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

class PayExecApi(object):
    def __init__(self, database):
        self.database = database

    @cherrypy.expose
    def make_payment(self):
        """Adds transaction to database
        Check database structure doc
        
        Arguments:
            json -- check api doc for json format
        """
        
        error_msg = ""
        success = False

        #extract information from JSON object
        JSON_object = json.loads(cherrypy.request.body.read().decode('utf-8'))
        is_paid = JSON_object.get("is_paid")
        payment_id = JSON_object.get("payment_id")
        
        try:
            #checking if user is logged in successfully
            username = cherrypy.session["username"]
            password = cherrypy.session["password"]
            isLoggedIn = self.database.password_is_correct(username, password)

            if (isLoggedIn == True):
                #make payment if user is Logged in
                success = self.database.make_payment(payment_id, is_paid)
            else:
                error_msg = "User not logged in"
                success = False

        except KeyError as e:
            error_msg = "User not logged in"

        except Exception as e:
            print(e)
            error_msg = "Unknown error occured"
            
        finally:
            response = {
                'success' : success,
                'message' : error_msg
            }
            return json.dumps(response)