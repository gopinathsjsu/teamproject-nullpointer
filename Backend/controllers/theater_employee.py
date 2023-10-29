from flask import Blueprint, request, jsonify

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer


theater_employee = Blueprint('theater_employee', __name__)
logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)


# @theater_employee.route('/api/theater_employee/insert_movie', methods=['POST'])
# def insert_movie():
#     data = request.get_json()

#     movie_data = {
#         "name": data["movie"],
        
#     }
#     movie_id = cmpe202_db_client.movies_coll.insert_one({}).inserted_id

#     logger.info("Testing dummy {0}".format(dummy))

#     return jsonify(dummy)
