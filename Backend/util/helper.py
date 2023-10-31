from bson.objectid import ObjectId
import datetime
from flask import abort, jsonify, make_response, request
from functools import wraps
import jwt

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer


logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)


def verify_user_cred(username, password):
    rec = cmpe202_db_client.theater_employees.find_one({"username": username})
    try:
        if "password" in rec and password == rec["password"]:
            return True
        else:
            logger.error(f"Incorrect Password for Username: {username}")
    except TypeError:
        logger.error(f"Record for Username: {username} not Found")

    return False


def generate_token(username):
    data_to_encode = {
        "user": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    token = jwt.encode(payload=data_to_encode, key=app_config.SECRET_KEY, algorithm='HS256')

    return token


def check_auth_theater_employee(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            token = request.headers['x-access-token']
        except KeyError:
            logger.error(f"Token is missing")
            return abort(make_response(jsonify({"message": "Token is missing"}), 403))  
        
        try:
            decoded_token_obj = jwt.decode(token, key=app_config.SECRET_KEY, algorithms=['HS256'])
        except:
            logger.error(f"Token is invalid")
            return abort(make_response(jsonify({"message": "Token is invalid"}), 401))
        
        return f(*args, **kwargs)
    
    return decorated_function


def clean_obj(obj):
    for key in tuple(obj):
        value = obj[key]
        if isinstance(value, ObjectId):
            obj[key] = str(value)
        if key == "_id":
            obj["id"] = obj["_id"]
            del obj["_id"]
