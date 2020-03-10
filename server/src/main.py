import os

import cherrypy

import server

import socket

LISTEN_IP = "0.0.0.0"
LISTEN_PORT = 1234

def run_main_app():
    conf = {
        '/': {
            'tools.staticdir.root': os.getcwd(),
            'tools.encode.on': True,
            'tools.encode.encoding': 'utf-8',
            'tools.sessions.on': True,
            'tools.sessions.timeout': 60 * 1, #timeout is in minutes, * 60 to get hours

            # The default session backend is in RAM. Other options are 'file',
        },

        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'static',
        },
    }

    cherrypy.site = {
        'base_path': os.getcwd()
    }
    
    cherrypy.tree.mount(server.ApiServer(), "/api/", conf)
    cherrypy.tree.mount(server.MainApp(), "/", conf)

    cherrypy.config.update({'server.socket_host': LISTEN_IP,
                            'server.socket_port': LISTEN_PORT,
                            'engine.autoreload.on': True,
                           })

    print("========================================")
    print("           Softeng 701 Server")
    print("========================================")

    cherrypy.engine.start()

    cherrypy.engine.block()

if __name__ == '__main__':
    run_main_app()
