from bson.objectid import ObjectId
import datetime
from flask import abort, jsonify, make_response, request
from functools import wraps
import jwt

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer


logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(
    __name__).get_collection_instance(app_config.db_name)


def fetch_user_details(username):
    rec = cmpe202_db_client.users.find_one({
        "username": username,
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })

    if rec and "isAdmin" not in rec:  # POST_PURGE remove
            rec["isAdmin"] = rec["is_admin"]
    
    if rec and "is_member" not in rec:
        rec["isMember"] = False
    
    if "is_member" in rec:
        rec["isMember"] = rec["is_member"]

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
        "isAdmin": user_record["isAdmin"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload=data_to_encode,
                       key=app_config.SECRET_KEY, algorithm='HS256')

    return token


def decode_token(token):
    user_data = {}
    decoded_token_obj = jwt.decode(
        token, key=app_config.SECRET_KEY, algorithms=['HS256'])
    try:
        user_id = decoded_token_obj["user_id"]
        rec = cmpe202_db_client.users.find_one(
            {
                "_id": ObjectId(user_id),
                "$or": [
                    {"deleted": {"$exists": False}},
                    {"deleted": False}
                ]
            },
            {"password": 0}
        )

        if "vip_until" in rec:
            rec["isMember"] = True if rec["vip_until"] >= datetime.datetime.utcnow(
            ) else False

        if "isAdmin" not in rec:  # POST_PURGE remove
            rec["isAdmin"] = rec["is_admin"]

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
                # decoded_token_obj = jwt.decode(token, key=app_config.SECRET_KEY, algorithms=['HS256'])
                # user_id = decoded_token_obj["user_id"]
                # user_data = cmpe202_db_client.users.find_one({"_id": ObjectId(user_id)})

                user_data = decode_token(token)

                kwargs["user_id"] = user_data["_id"] if "_id" in user_data else ""
                kwargs["user"] = user_data["username"] if "username" in user_data else ""
                kwargs["is_member"] = user_data["isMember"] if "isMember" in user_data else ""
                kwargs["points"] = user_data["points"] if "points" in user_data else ""

                if "Admin" in roles and "isAdmin" in user_data and user_data["isAdmin"]:
                    authorized_cond = True
                if "Member" in roles and user_data["isMember"]:
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
        elif isinstance(obj[key], datetime.datetime):
            obj[key] = obj[key].isoformat()


# Cleans the whole list, including changing datetime objects to ISO 8601 strings and removing metadata
def clean_list(obj):
    keys_to_remove = []
    for k in obj:
        if isinstance(k, (list, dict)):
            clean_list(k)
        elif isinstance(obj[k], (list, dict)):
            clean_list(obj[k])
        elif isinstance(obj[k], ObjectId):
            obj[k] = str(obj[k])
        elif isinstance(obj[k], datetime.datetime):
            if (k == "added_date"):
                keys_to_remove.append(k)
            else:
                obj[k] = obj[k].isoformat()
        elif isinstance(obj[k], str) and k == "added_by":
            keys_to_remove.append(k)
    for k in keys_to_remove:
        del obj[k]


# To set the token variables without requiring it
def set_token_vars():
    def auth_wrapper_func(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                token = request.headers['x-access-token']
            except KeyError:
                return f(*args, **kwargs)

            try:
                user_data = decode_token(token)

                kwargs["user_id"] = user_data["_id"] if "_id" in user_data else ""
                kwargs["user"] = user_data["username"] if "username" in user_data else ""
                kwargs["is_member"] = user_data["isMember"] if "isMember" in user_data else ""
                kwargs["points"] = user_data["points"] if "points" in user_data else ""

            except Exception as e:
                logger.error(f"Token is invalid")
                return abort(make_response(jsonify({"message": "Token is invalid"}), 401))
            return f(*args, **kwargs)
        return decorated_function
    return auth_wrapper_func

# Registers given user
def register_user(user):
    # check if username does not exist in database
    userExists = cmpe202_db_client.users.find_one({
        "username": user["username"],
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })
    if userExists:
        return jsonify({"message": "Username already taken"}), 409

    cmpe202_db_client.users.insert_one(user)
    return jsonify({"message": "Successful"}), 201


# Converts javascript date ISO to python datetime
def jsdate_to_datetime(js_date):
    if js_date.endswith('Z'):
        return datetime.datetime.fromisoformat(js_date[:-1])
    return datetime.datetime.fromisoformat(js_date)
