from flask import Blueprint, jsonify

import config.app_config as app_config
from util.db_initializer import DBServiceClient


resource = Blueprint('resource', __name__)
db_service_client = DBServiceClient(app_config.mongodb_username, app_config.mongodb_password, app_config.db_name)


@resource.route('/api/get_movie_showtimes', methods=['GET'])
def fetch_movie_showtimes():
    rec = db_service_client.cmpe202_db.dummy.find_one({})
    dummy = {
        "id": str(rec["_id"]),
        "message": rec["message"]
    }

    return jsonify(dummy)
