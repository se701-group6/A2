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
    @cherrypy.expose
    def make_payment(self):
        """Adds transaction to database
        Check database structure doc
        
        Arguments:
            json -- check api doc for json format
        """
        return "1"