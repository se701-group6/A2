import cherrypy
import urllib.request
import json
import base64
import socket

SITE_ROOT = "../../frontend"

class MainApp(object):

    _cp_config = {'tools.encode.on': True,
                  'tools.encode.encoding': 'utf-8',
                  'tools.sessions.on' : 'True',
                 }

    @cherrypy.expose
    def default(self, *args, **kwargs):
        """The default page, given when we don't recognise where the request is for."""
        page = open(SITE_ROOT + "/test/index.html", "r")
        cherrypy.response.status = "404server"
        return page

    @cherrypy.expose
    def index(self):
        """
        This method serves the client the page
        Returns:
            String -- returns a string in html format
        """
        page = open(SITE_ROOT + "/test/index.html", "r")
        return page
