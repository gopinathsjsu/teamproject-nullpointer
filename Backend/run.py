# #!/usr/bin/env python3.11
# -*- coding: utf-8 -*-

from flask_cors import CORS

# import blueprints of endpoints grouped by resource
from controllers.resource import resource
from util.app_initializer import AppInitializer
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger


app = AppInitializer.get_instance(__name__).get_flask_app()

# register all blueprints with Flask app
app.register_blueprint(resource)

CORS(app, expose_headers=["x-attached-filename", "Content-Disposition"])

# Initializing the MongoDB connection client
DBServiceInitializer.get_db_instance(__name__)

# Initializing Logger
AppLogger.getInstance(__name__).getLogger()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("8005"), debug=False, use_reloader=False)
