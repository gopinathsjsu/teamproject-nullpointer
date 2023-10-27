from flask import Blueprint, request
from bson import json_util
import json
from bson.objectid import ObjectId

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer


home = Blueprint('home', __name__)
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)

def map_reduce(obj):
  el = { "id" : obj["_id"]["$oid"] }
  for x in obj.keys():
    if(x!="_id"):
      el[x] = obj[x]
  return el

@home.route('/api/get_locations', methods=['GET'])
def fetch_locations():
  locations = cmpe202_db_client.locations.find({})
  location_json = json.loads(json_util.dumps(locations))
  return list(map(map_reduce, location_json))

@home.route('/api/get_theatres', methods=['GET'])
def fetch_theatres():
  # location_id = request.args["location_id"]
  # theatres = cmpe202_db_client.find({"location_id":ObjectId(location_id)})
  theatres = []
  return list(map(map_reduce, theatres))