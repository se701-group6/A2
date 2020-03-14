import os

import cherrypy

import server
import api.base_api

from db_manager import DatabaseManager 

DB_NAME = "webapp_data.db"

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
    database = DatabaseManager()
    database.init_db(DB_NAME)

    main_app = server.MainApp()
    main_app.api = api.base_api.BaseApi(database)
    cherrypy.tree.mount(main_app, "/", conf)

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
