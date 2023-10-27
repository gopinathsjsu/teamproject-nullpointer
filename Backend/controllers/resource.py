from flask import Blueprint, jsonify

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

# @resource.route('/api/create_account', methods=['POST'])
# def create_account(username, password):
    return jsonify(dummy)
