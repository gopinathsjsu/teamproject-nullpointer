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


def fetch_user_details(username):
    rec = cmpe202_db_client.users.find_one({"username": username})
    return rec


def verify_user_cred(username, password, user_record):
    try:
        if "password" in user_record and password == user_record["password"]:
            return True
        else:
            logger.error(f"Incorrect Password for Username: {username}")
    except TypeError:
        logger.error(f"Record for Username: {username} not Found")

    return False


def generate_token(user_record):
    data_to_encode = {
        "user_id": str(user_record["_id"]),
        # "username": user_record["username"],
        # "isMember": user_record["isMember"],
        # "isAdmin": user_record["isAdmin"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload=data_to_encode, key=app_config.SECRET_KEY, algorithm='HS256')

    return token


def decode_token(token):
    user_data = {}
    decoded_token_obj = jwt.decode(token, key=app_config.SECRET_KEY, algorithms=['HS256'])
    try:
        user_id = decoded_token_obj["user_id"]
        rec = cmpe202_db_client.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        clean_obj(rec)
        user_data = dict(user_data, **rec)
    except KeyError:
        logger.error("User ID not found in the token")
    return user_data


def check_auth(roles=[]):
    def auth_wrapper_func(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            authorized_cond = False
            if len(roles) == 0:
                authorized_cond = True

            try:
                token = request.headers['x-access-token']
            except KeyError:
                logger.error(f"Token is missing")
                return abort(make_response(jsonify({"message": "Token is missing"}), 403))  
            try:
                decoded_token_obj = jwt.decode(token, key=app_config.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token_obj["user_id"]
                user_data = cmpe202_db_client.users.find_one({"_id": ObjectId(user_id)})

                kwargs["user_id"] = user_id
                kwargs["user"] = user_data["username"]
                kwargs["is_member"] = user_data["isMember"]

                if "Admin" in roles and "isAdmin" in user_data and user_data["isAdmin"]:
                    authorized_cond = True
                if "Member" in roles and "isMember" in user_data and user_data["isMember"]:
                    authorized_cond = True

            except KeyError:
                logger.error(f"Token is invalid")
                return abort(make_response(jsonify({"message": "Token is invalid"}), 401))
            if not authorized_cond:
                return abort(make_response(jsonify({"message": "User not Authorised"}), 401))
            return f(*args, **kwargs)
        return decorated_function
    return auth_wrapper_func


def clean_obj(obj):
    for key in tuple(obj):
        value = obj[key]
        if isinstance(value, ObjectId):
            obj[key] = str(value)
        if key == "_id":
            obj["id"] = obj["_id"]
            del obj["_id"]


#Cleans the whole list
def clean_list(obj):
    for k in obj:
        if isinstance(k, (list, dict)):
            clean_list(k)
        elif isinstance(obj[k], (list, dict)):
            clean_list(obj[k])
        elif isinstance(obj[k], ObjectId):
            obj[k] = str(obj[k])


#To set the token variables without requiring it
def set_token_vars():
    def auth_wrapper_func(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                token = request.headers['x-access-token']
            except KeyError:
                return f(*args, **kwargs)
            
            try:
                decoded_token_obj = jwt.decode(token, key=app_config.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token_obj["user_id"]
                user_data = cmpe202_db_client.users.find_one({"_id": ObjectId(user_id)})

                kwargs["user_id"] = user_id
                kwargs["user"] = user_data["username"]
                kwargs["is_member"] = user_data["isMember"]
            except Exception as e:
                logger.error(f"Token is invalid")
                return abort(make_response(jsonify({"message": "Token is invalid"}), 401))
            return f(*args, **kwargs)
        return decorated_function
    return auth_wrapper_func