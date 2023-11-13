# #!/usr/bin/env python3.11
# -*- coding: utf-8 -*-

from flask import abort, jsonify, make_response, request
from flask_cors import CORS

# import blueprints of endpoints grouped by resource
from controllers.home import home
from controllers.resource import resource
from controllers.theater_employee import theater_employee

from util.app_initializer import AppInitializer
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer
from util.helper import clean_obj, decode_token, generate_token, fetch_user_details, verify_user_cred


app = AppInitializer.get_instance(__name__).get_flask_app()

# register all blueprints with Flask app
app.register_blueprint(home)
app.register_blueprint(resource)
app.register_blueprint(theater_employee)

CORS(app, expose_headers=["x-attached-filename", "Content-Disposition"])

# Initializing the MongoDB connection client
DBServiceInitializer.get_db_instance(__name__)

# Initializing Logger
logger = AppLogger.getInstance(__name__).getLogger()


@app.route('/api/login', methods=['POST'])
def get_access_key():
    username = request.form.get("username", None) 
    password = request.form.get("password", None)
    
    if username is None or password is None:
        return abort(make_response(jsonify(error=f"Please provide Username or Password."), 400))
    
    user_record = fetch_user_details(username)
    if verify_user_cred(username, password, user_record):
        access_token = generate_token(user_record)
        clean_obj(user_record)
        del user_record["password"]
        return jsonify({"access_token": access_token, "user_data": user_record})
    
    return abort(make_response(jsonify(error=f"Incorrect Username or Password."), 400))


@app.route('/api/decode_access_token', methods=['GET'])
def decode_access_token():
    access_token = request.headers['x-access-token']

    if access_token is None:
        return abort(make_response(jsonify(error=f"Please provide x-access-token in headers"), 400))
    
    try:
        decoded_token_obj = decode_token(access_token)
        return jsonify({"decoded_token_data": decoded_token_obj})
    except Exception as e:
        logger.error(f"Token is invalid cannot be decoded")
    return jsonify({"message": "Token is invalid cannot be decoded"})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("8005"), debug=False, use_reloader=False)
