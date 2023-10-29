from flask import Blueprint, jsonify

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger


resource = Blueprint('resource', __name__)
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)
logger = AppLogger.getInstance(__name__).getLogger()


@resource.route('/api/get_movie_showtimes', methods=['GET'])
def fetch_movie_showtimes():
    rec = cmpe202_db_client.dummy.find_one({})
    dummy = {
        "id": str(rec["_id"]),
        "message": rec["message"]
    }
    logger.info("Testing dummy {0}".format(dummy))

    return jsonify(dummy)
