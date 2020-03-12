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

class BillDataApi(object):
    @cherrypy.expose
    def list_bills(self):
        """Searches database for all bills
            does not modify database
            Check database structure doc
            
        Arguments:
            json -- check api doc for json format
        """
        return "4"
    
    @cherrypy.expose
    def get_bill(self):
        """Searches database for transaction info on specific transaction id
            does not modify database
            Check database structure doc
        
        Arguments:
            json -- check api doc for json format
        """
        pass