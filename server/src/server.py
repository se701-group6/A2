import cherrypy
import urllib.request
import json

SITE_ROOT = "../../split-webapp/split"

class MainApp(object):

    _cp_config = {'tools.encode.on': True,
                  'tools.encode.encoding': 'utf-8',
                  'tools.sessions.on' : 'True',
                 }

    @cherrypy.expose
    def default(self, *args, **kwargs):
        """The default page, given when we don't recognise where the request is for."""
        page = open(SITE_ROOT + "/public/index.html", "r")
        cherrypy.response.status = "404server"
        return page

    @cherrypy.expose
    def index(self):
        """
        This method serves the client the page
        Returns:
            String -- returns a string in html format
        """
        page = open(SITE_ROOT + "/public/index.html", "r")
        return page
