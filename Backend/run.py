#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-

from flask_cors import CORS
from util.app_initializer import AppInitializer


# import blueprints of endpoints grouped by resource
from controllers.resource import resource


app = AppInitializer.get_instance(__name__).get_flask_app()
CORS(app, expose_headers=["x-attached-filename", "Content-Disposition"])


# register all blueprints with Flask app
app.register_blueprint(resource)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("8005"), debug=False, use_reloader=False)
