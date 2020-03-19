import os

import cherrypy

import server
import api.base_api

from db_manager import DatabaseManager 

DB_NAME = "webapp_data.db"
CREATE_TEST_DATA = True

LISTEN_IP = "0.0.0.0"
LISTEN_PORT = int(os.getenv("SITE_PORT"))
if LISTEN_PORT is None:
    LISTEN_PORT = 1234
SITE_ROOT = os.getenv("SITE_ROOT")
if SITE_ROOT is None:
    # if no environment variable has been set, we will assume the server is being used in development
    SITE_ROOT = "../../split-webapp/split/build"

def run_main_app():
    conf = {
        '/': {
            'tools.staticdir.root': os.path.abspath(SITE_ROOT),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': '.',
            'tools.staticdir.index': "index.html",

            'tools.encode.on': True,
            'tools.encode.encoding': 'utf-8',
            'tools.sessions.on': True,
            'tools.sessions.timeout': 60 * 1, # timeout is in minutes, * 60 to get hours

            # The default session backend is in RAM. Other options are 'file'
        }
    }

    cherrypy.site = {
        'base_path': os.getcwd()
    }
    database = DatabaseManager()
    database.init_db(DB_NAME)
    if CREATE_TEST_DATA:
        database.create_test_data()

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
