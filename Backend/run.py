# #!/usr/bin/env python3.11
# -*- coding: utf-8 -*-

from flask import abort, jsonify, make_response, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from datetime import datetime

# import blueprints of endpoints grouped by resource
from controllers.resource import resource
from controllers.theater_employee import theater_employee

from util.app_initializer import AppInitializer
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer
from util.helper import clean_obj, decode_token, generate_token, fetch_user_details, verify_user_cred, register_user, check_auth


app = AppInitializer.get_instance(__name__).get_flask_app()

# register all blueprints with Flask app
app.register_blueprint(resource)
app.register_blueprint(theater_employee)

CORS(app, expose_headers=["x-attached-filename", "Content-Disposition"])

# Initializing the MongoDB connection client
DBServiceInitializer.get_db_instance(__name__)

# Initializing Logger
logger = AppLogger.getInstance(__name__).getLogger()

# Initilizing hasher
hasher = Bcrypt(app)


@app.route('/api/login', methods=['POST'])
def get_access_key():
    username = request.form.get("username", None)
    password = request.form.get("password", None)

    if username is None or password is None:
        return abort(make_response(jsonify(error=f"Please provide Username or Password."), 400))

    user_record = fetch_user_details(username)

    try:
        if hasher.check_password_hash(user_record["password"], password):
            access_token = generate_token(user_record)
            clean_obj(user_record)
            del user_record["password"]
            return jsonify({"access_token": access_token, "user_data": user_record})
    except Exception as e:
        return abort(make_response(jsonify(error=f"Incorrect Username or Password."), 400))

    # if verify_user_cred(username, password, user_record):
    #     access_token = generate_token(user_record)
    #     clean_obj(user_record)
    #     del user_record["password"]
    #     return jsonify({"access_token": access_token, "user_data": user_record})

    return abort(make_response(jsonify(error=f"Incorrect Username or Password."), 400))


# Putting this in here to better match login
@app.route('/api/create_account', methods=['POST'])
def register():
    val = request.get_json()

    username = val["username"] if "username" in val else None
    password = val["password"] if "password" in val else None

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    hashed_password = hasher.generate_password_hash(password).decode('utf-8')

    user = {
        "username": username,
        "password": hashed_password,
        "is_admin": False,
        "points": 0,
        "vip_until": datetime.utcnow(),
    }

    return register_user(user)


# To create a new admin account, only admins can create new admins
@app.route('/api/create_account_admin', methods=['POST'])
@check_auth(roles=["Admin"])
def register_admin(*args, **kwargs):
    val = request.get_json()

    username = val["username"] if "username" in val else None
    password = val["password"] if "password" in val else None

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    hashed_password = hasher.generate_password_hash(password).decode('utf-8')

    user = {
        "username": username,
        "password": hashed_password,
        "is_admin": True,
        "points": 0,
        "vip_until": datetime.utcnow(),
    }

    return register_user(user)


@app.route('/api/user', methods=['GET'])
def decode_access_token():
    access_token = request.headers['x-access-token']

    if access_token is None:
        return abort(make_response(jsonify(error=f"Please provide x-access-token in headers"), 400))

    try:
        user_data = decode_token(access_token)
        clean_obj(user_data)
        return jsonify({"user_data": user_data})
    except Exception as e:
        logger.error(f"Token is invalid cannot be decoded")

    return abort(make_response(jsonify(error=f"Token is invalid cannot be decoded"), 401))


# TODO: remove once db is stable
# Creates a default admin account, here for easy automation
@app.route('/api/create_account_admin_default', methods=['POST'])
def register_admin_default():

    username = "Admin"
    password = "Password"

    hashed_password = hasher.generate_password_hash(password).decode('utf-8')

    user = {
        "username": username,
        "password": hashed_password,
        "is_admin": True,
        "points": 0,
        "vip_until": datetime.utcnow(),
    }

    return register_user(user)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("8005"), debug=False, use_reloader=False)
