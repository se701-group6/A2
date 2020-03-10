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

class AccountApi(object):
    @cherrypy.expose
    def register(self):
        """Called when client requests to register, should create the user on the user database, 
            after creating a new user the client should be logged in
        
        Arguments:
            json -- check api doc for json format
        """
        return "1"
    
    @cherrypy.expose
    def login(self):
        """Will verify user identity by checking user and password on user database
        
        Arguments:
            json -- check api doc for json format
        """
        pass