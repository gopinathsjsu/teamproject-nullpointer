
from flask import Blueprint, jsonify, request
from flask_api import status
import config.app_config as app_config
from util.db_initializer import DBServiceInitializer


resource = Blueprint('resource', __name__)
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)



@resource.route('/api/get_movie_showtimes', methods=['GET'])
def fetch_movie_showtimes():

    rec = cmpe202_db_client.dummy.find_one({})

    dummy = {
        "id": str(rec["_id"]),
        "message": rec["message"]
    }

    return jsonify(dummy)

@resource.route('/api/login', methods=['POST'])
def login():
    val = request.get_json()
    # check if username exists in database
    userExists = cmpe202_db_client.account.find_one({"username": val["username"]})

    if userExists and userExists["password"] == val["password"]:
        return jsonify({"message": "Successful"}), status.HTTP_200_OK

    return jsonify({"message": "Unsuccessful"}), status.HTTP_400_BAD_REQUEST


@resource.route('/api/create_account', methods=['POST'])
def create_account():
    val = request.get_json()

    # check if username does not exist in database
    userExists = cmpe202_db_client.account.find_one({"username": val["username"]})
    if userExists:
        return jsonify({"message": "Unsuccesful"}), status.HTTP_400_BAD_REQUEST

    cmpe202_db_client.account.insert_one(val)
    return jsonify({"message": "Successful"})

#@resource.route('/api/get_account', methods=['GET'])

