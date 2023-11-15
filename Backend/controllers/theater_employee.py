from bson import ObjectId
import calendar
import datetime
from flask import abort, Blueprint, make_response, request, jsonify

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer
from util.helper import check_auth, clean_obj, clean_list


theater_employee = Blueprint('theater_employee', __name__)
logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)


#Expects in body: movie_name (str)
@theater_employee.route('/api/theater_employee/insert_movie', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_movie(*args, **kwargs):
    data = request.get_json()

    movie_data = {
        "name": data["movie_name"],
        "added_date": datetime.datetime.now(),
        "added_by": kwargs["user"]
    }
    movie_id = cmpe202_db_client.movies.insert_one(movie_data).inserted_id

    logger.info("New Movie Inserted : ID ({0})".format(str(movie_id)))

    return jsonify({"movie_id": str(movie_id)})


@theater_employee.route('/api/theater_employee/get_movies', methods=['GET'])
@check_auth(roles=["Admin"])
def get_movies(*args, **kwargs):
    movies = list(cmpe202_db_client.movies.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    }))
        
    clean_list(movies)

    return jsonify(movies)


@theater_employee.route('/api/theater_employee/delete_movie/<movie_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_movie(movie_id, *args, **kwargs):

    cmpe202_db_client.movies.update_one(
        {'_id': ObjectId(movie_id)}, {"$set": {"deleted": True}})
    
    logger.info("Movie Deleted : ID ({0})".format(str(movie_id)))

    return jsonify({"message": "Movie Deletion Successfull"})


#Expects in body: location (str)
@theater_employee.route('/api/theater_employee/insert_location', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_location(*args, **kwargs):
    data = request.get_json()

    location_data = {
        "name": data["location"],
        "added_date": datetime.datetime.now(),
        "added_by": kwargs["user"]
    }
    location_id = cmpe202_db_client.locations.insert_one(location_data).inserted_id

    logger.info("New Location Inserted : ID ({0})".format(str(location_id)))

    return jsonify({"location_id": str(location_id)})


@theater_employee.route('/api/theater_employee/get_locations', methods=['GET'])
@check_auth(roles=["Admin"])
def get_locations(*args, **kwargs):
    locations = list(cmpe202_db_client.locations.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    }))

    clean_list(locations)
    return jsonify(locations)


@theater_employee.route('/api/theater_employee/delete_location/<location_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_location(location_id, *args, **kwargs):

    cmpe202_db_client.locations.update_one(
        {'_id': ObjectId(location_id)}, {"$set": {"deleted": True}})
    
    logger.info("Location Deleted : ID ({0})".format(str(location_id)))

    return jsonify({"message": "Location Deletion Successfull"})


@theater_employee.route('/api/theater_employee/insert_multiplex', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_multiplex(*args, **kwargs):
    data = request.get_json()

    multiplex_data = {
        "name": data["name"],
        "location_id": ObjectId(data["location_id"]),
        "created": datetime.datetime.utcnow(),
        "user": kwargs["user"]
    }
    multiplex_id = cmpe202_db_client.multiplexes.insert_one(multiplex_data).inserted_id

    logger.info("New Multiplex Inserted : ID ({0})".format(str(multiplex_id)))

    return jsonify({"multiplex_id": str(multiplex_id)})


@theater_employee.route('/api/theater_employee/get_multiplexes', methods=['GET'])
@check_auth(roles=["Admin"])
def get_multiplexes(*args, **kwargs):
    response = []

    multiplexes_cursor = cmpe202_db_client.multiplexes.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })
        
    for rec in multiplexes_cursor:
        clean_obj(rec)
        response.append(rec)

    return jsonify(response)


@theater_employee.route('/api/theater_employee/delete_multiplex/<multiplex_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_multiplex(multiplex_id, *args, **kwargs):

    cmpe202_db_client.multiplexes.update_one(
        {'_id': ObjectId(multiplex_id)}, {"$set": {"deleted": True}})
    
    logger.info("Multiplex Deleted : ID ({0})".format(str(multiplex_id)))

    return jsonify({"message": "Multiplex Deletion Successfull"})


@theater_employee.route('/api/theater_employee/insert_theater', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_theater(*args, **kwargs):
    data = request.get_json()

    theater_data = {
        "name": data["name"],
        "multiplex_id": ObjectId(data["multiplex_id"]),
        "location_id": ObjectId(data["location_id"]),
        "seating_capacity": data["seating_capacity"],
        "created": datetime.datetime.utcnow(),
        "user": kwargs["user"]
    }
    theater_id = cmpe202_db_client.theaters.insert_one(theater_data).inserted_id

    logger.info("New Theater Inserted : ID ({0})".format(str(theater_id)))

    return jsonify({"theater_id": str(theater_id)})


@theater_employee.route('/api/theater_employee/get_theaters', methods=['GET'])
@check_auth(roles=["Admin"])
def get_theaters(*args, **kwargs):
    response = []

    theaters_cursor = cmpe202_db_client.theaters.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    })
        
    for rec in theaters_cursor:
        clean_obj(rec)
        response.append(rec)

    return jsonify(response)


@theater_employee.route('/api/theater_employee/delete_theater/<theater_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_theater(theater_id, *args, **kwargs):

    cmpe202_db_client.theaters.update_one(
        {'_id': ObjectId(theater_id)}, {"$set": {"deleted": True}})
    
    logger.info("Theater Deleted : ID ({0})".format(str(theater_id)))

    return jsonify({"message": "Theater Deletion Successfull"})


@theater_employee.route('/api/theater_employee/update_theater_seatings/<theater_id>', methods=['PUT'])
@check_auth(roles=["Admin"])
def update_theater_seatings(theater_id, *args, **kwargs):
    data = request.get_json()

    cmpe202_db_client.theaters.update_one(
        {"_id": ObjectId(theater_id)},
        {"$set": {
            "seating_capacity": data["seating_capacity"]
        }}
    )

    logger.info("Theater Seating Updated : ID ({0})".format(str(theater_id)))

    return jsonify({"message": "Theater Seating Updation Successfull"})


@theater_employee.route('/api/theater_employee/insert_showtimes', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_showtimes(*args, **kwargs):
    data = request.get_json()

    showtime_ids = []
    show_days = dict(data["show_days"])
    for show_day_rec in show_days:
        show_day_timestamp = datetime.datetime.strptime(show_day_rec["show_day_timestamp"], "%d%b%Y%H%M%S") 
        show_day = calendar.day_name[show_day_timestamp.weekday()]
        for show_time in show_day_rec["show_times"]: 
            showtime_data = {
                "theater_id": ObjectId(data["theater_id"]),
                "movie_id": data["movie_id"],
                "show_date": datetime.datetime.strptime(show_day_timestamp, "%d%b%Y%H%M%S"),
                "show_day": show_day,
                "show_time": datetime.datetime.strptime(show_time, "%H:%M:%S"),
                "seating_capacity": data["seating_capacity"],
                "created": datetime.datetime.utcnow(),
                "discount_criteria": data["discount_criteria"],
                "user": kwargs["user"],
                "seats_filled": 0
            }

            showtime_id = cmpe202_db_client.showtimes.insert_one(showtime_data).inserted_id
            showtime_ids.append(str(showtime_id))
            logger.info("New Showtime Inserted : ID ({0})".format(str(showtime_id)))

    return jsonify({"showtime_ids": showtime_ids})


@theater_employee.route('/api/theater_employee/update_showtime/<showtime_id>', methods=['PUT'])
@check_auth(roles=["Admin"])
def update_showtime(showtime_id, *args, **kwargs):
    data = request.get_json()

    cmpe202_db_client.showtimes.update_one(
        {"_id": ObjectId(showtime_id)},
        {"$set": {
            "discount_criteria": data["discount_criteria"]
        }}
    )

    logger.info("Showtime discount_criteria Updated : ID ({0})".format(str(showtime_id)))

    return jsonify({"message": "Showtime discount_criteria Updation Successfull"})


@theater_employee.route('/api/theater_employee/delete_showtime/<showtime_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_showtime(showtime_id, *args, **kwargs):

    cmpe202_db_client.showtimes.update_one(
        {'_id': ObjectId(showtime_id)}, {"$set": {"deleted": True}})
    
    logger.info("Showtime Deleted : ID ({0})".format(str(showtime_id)))

    return jsonify({"message": "Showtime Deletion Successfull"})


# @theater_employee.route('/api/theater_employee/get_theater_summary', methods=['GET'])
# @check_auth(roles=["Admin"])
# def get_theater_summary(*args, **kwargs):
#     start_date = request.args.get("start_date", None)

#     if theater_id is None:
#         return abort(make_response(jsonify(error="Theater ID not provided"), 400))
    
#     if start_date is None:
#         return abort(make_response(jsonify(error="Start Date not provided"), 400))
    
#     theater_summary_cursor = cmpe202_db_client.showtimes.find({
#         "theater_id": ObjectId(theater_id),
#         "created": {"$gte": start_date}
#     })

#     response = []

#     for rec in theaters_cursor:
#         clean_obj(rec)
#         response.append(rec)

#     return jsonify(response)
