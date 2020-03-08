import cherrypy
import urllib.request
import json
import base64
import socket

SITE_ROOT = "../../frontend"

class MainApp(object):

	#CherryPy Configuration
    _cp_config = {'tools.encode.on': True,
                  'tools.encode.encoding': 'utf-8',
                  'tools.sessions.on' : 'True',
                 }

	# If they try somewhere we don't know, catch it here and send them to the right place.
    @cherrypy.expose
    def default(self, *args, **kwargs):
        """The default page, given when we don't recognise where the request is for."""
        Page = open(SITE_ROOT + "/test/index.html", "r")
        cherrypy.response.status = "404server"
        return Page

    # PAGES (which return HTML that can be viewed in browser)
    @cherrypy.expose
    def index(self):
        Page = Page = open(SITE_ROOT + "/test/index.html", "r")
        return Page


class apiServer(object):
    pass;