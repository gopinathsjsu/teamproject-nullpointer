from bson import json_util
from bson.objectid import ObjectId
from flask import Blueprint, request, jsonify
import json

import config.app_config as app_config
from helpers import map_obj_id
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer


home = Blueprint('home', __name__)
logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)


@home.route('/api/get_locations', methods=['GET'])
def fetch_locations():
  locations = cmpe202_db_client.locations.find({})
  location_json = json.loads(json_util.dumps(locations))
  return jsonify(list(map(map_obj_id, location_json)))


@home.route('/api/get_theatres', methods=['GET'])
def fetch_theatres():
  # location_id = request.args["location_id"]
  # theatres = cmpe202_db_client.find({"location_id":ObjectId(location_id)})
  theatres = []
  return list(map(map_obj_id, theatres))
