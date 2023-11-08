from bson import ObjectId
import datetime
from flask import Blueprint, request, jsonify

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer
from util.helper import check_auth_theater_employee, clean_obj


theater_employee = Blueprint('theater_employee', __name__)
logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)


@theater_employee.route('/api/theater_employee/insert_movie', methods=['POST'])
@check_auth_theater_employee
def insert_movie(*args, **kwargs):
    data = request.get_json()

    movie_data = {
        "movie_name": data["movie_name"],
        "created": datetime.datetime.utcnow(),
        "user": kwargs["user"]
    }
    movie_id = cmpe202_db_client.movies.insert_one(movie_data).inserted_id

    logger.info("New Movie Inserted : ID ({0})".format(str(movie_id)))

    return jsonify({"movie_id": str(movie_id)})


@theater_employee.route('/api/theater_employee/get_movies', methods=['GET'])
@check_auth_theater_employee
def get_movies(*args, **kwargs):
    response = []

    movies_cursor = cmpe202_db_client.movies.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })
        
    for rec in movies_cursor:
        clean_obj(rec)
        response.append(rec)

    return jsonify(response)


@theater_employee.route('/api/theater_employee/delete_movie/<movie_id>', methods=['DELETE'])
@check_auth_theater_employee
def delete_movie(movie_id, *args, **kwargs):

    cmpe202_db_client.movies.update_one(
        {'_id': ObjectId(movie_id)}, {"$set": {"deleted": True}})
    
    logger.info("Movie Deleted : ID ({0})".format(str(movie_id)))

    return jsonify({"message": "Movie Deletion Successfull"})


@theater_employee.route('/api/theater_employee/insert_location', methods=['POST'])
@check_auth_theater_employee
def insert_location(*args, **kwargs):
    data = request.get_json()

    location_data = {
        "location": data["location"],
        "created": datetime.datetime.utcnow(),
        "user": kwargs["user"]
    }
    location_id = cmpe202_db_client.locations.insert_one(location_data).inserted_id

    logger.info("New Location Inserted : ID ({0})".format(str(location_id)))

    return jsonify({"location_id": str(location_id)})


@theater_employee.route('/api/theater_employee/get_locations', methods=['GET'])
@check_auth_theater_employee
def get_locations(*args, **kwargs):
    response = []

    locations_cursor = cmpe202_db_client.locations.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })
        
    for rec in locations_cursor:
        clean_obj(rec)
        response.append(rec)

    return jsonify(response)


@theater_employee.route('/api/theater_employee/delete_location/<location_id>', methods=['DELETE'])
@check_auth_theater_employee
def delete_location(location_id, *args, **kwargs):

    cmpe202_db_client.locations.update_one(
        {'_id': ObjectId(location_id)}, {"$set": {"deleted": True}})
    
    logger.info("Location Deleted : ID ({0})".format(str(location_id)))

    return jsonify({"message": "Location Deletion Successfull"})
