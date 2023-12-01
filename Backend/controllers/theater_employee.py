from bson import ObjectId
import calendar
import datetime
from flask import abort, Blueprint, make_response, request, jsonify

import config.app_config as app_config
from util.app_logger import AppLogger
from util.db_initializer import DBServiceInitializer
from util.helper import check_auth, clean_obj, clean_list, jsdate_to_datetime


theater_employee = Blueprint('theater_employee', __name__)
logger = AppLogger.getInstance(__name__).getLogger()
cmpe202_db_client = DBServiceInitializer.get_db_instance(
    __name__).get_collection_instance(app_config.db_name)


# TODO: Check for valid input
# TODO: Fix delete routes to cascade, so deleting a movie refunds all tickets for that movie and so on


# Expects in body: "image" (str), "title" (str) or "movie_name" (str)
@theater_employee.route('/api/theater_employee/insert_movie', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_movie(*args, **kwargs):
    data = request.get_json()

    name = ""
    if "movie_name" in data:
        name = data["movie_name"]
    elif "title" in data:
        name = data["title"]

    image = ""
    if "movie_name" in data:
        image = data["image"]

    movie_data = {
        "title": name,
        "image": image,
        "added_date": datetime.datetime.utcnow(),
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


# Expects in body: "title" (str) (opt), "image" (str) (opt)
# Can do either or both together
@theater_employee.route('/api/theater_employee/update_movie/<movie_id>', methods=['PATCH'])
@check_auth(roles=["Admin"])
def update_movie(movie_id, *args, **kwargs):
    data = request.get_json()

    update_data = {}

    if "title" in data:
        update_data["title"] = data["title"]

    if "image" in data:
        update_data["image"] = data["image"]

    cmpe202_db_client.movies.update_one(
        {"_id": ObjectId(movie_id)}, {"$set": update_data})

    logger.info("Movie : ID ({0})".format(movie_id))

    return jsonify({"message": "Movie Update Successfull"})


@theater_employee.route('/api/theater_employee/delete_movie/<movie_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_movie(movie_id, *args, **kwargs):

    cmpe202_db_client.movies.update_one(
        {'_id': ObjectId(movie_id)}, {"$set": {"deleted": True}})

    logger.info("Movie Deleted : ID ({0})".format(str(movie_id)))

    return jsonify({"message": "Movie Deletion Successfull"})


# Expects in body: "location" (str)
@theater_employee.route('/api/theater_employee/insert_location', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_location(*args, **kwargs):
    data = request.get_json()

    location_name = data["location"] if "location" in data else ""

    location_data = {
        "name": location_name,
        "added_date": datetime.datetime.utcnow(),
        "added_by": kwargs["user"]
    }
    location_id = cmpe202_db_client.locations.insert_one(
        location_data).inserted_id

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


# Expects in body: "name" (str)
@theater_employee.route('/api/theater_employee/update_location/<location_id>', methods=['PATCH'])
@check_auth(roles=["Admin"])
def update_location(location_id, *args, **kwargs):
    data = request.get_json()
    
    update_data = {}

    if "name" in data:
        update_data["name"] = data["name"]

    if "name" in data:
        cmpe202_db_client.locations.update_one(
            {"_id": ObjectId(location_id)},
            {"$set": update_data}
        )

    logger.info("location : ID ({0})".format(location_id))

    return jsonify({"message": "location Update Successfull"})


@theater_employee.route('/api/theater_employee/delete_location/<location_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_location(location_id, *args, **kwargs):

    cmpe202_db_client.locations.update_one(
        {'_id': ObjectId(location_id)}, {"$set": {"deleted": True}})

    logger.info("Location Deleted : ID ({0})".format(str(location_id)))

    return jsonify({"message": "Location Deletion Successfull"})


# @theater_employee.route('/api/theater_employee/insert_multiplex', methods=['POST'])
# @check_auth(roles=["Admin"])
# def insert_multiplex(*args, **kwargs):
#     data = request.get_json()

#     multiplex_data = {
#         "name": data["name"],
#         "location_id": ObjectId(data["location_id"]),
#         "created": datetime.datetime.utcnow(),
#         "user": kwargs["user"]
#     }
#     multiplex_id = cmpe202_db_client.multiplexes.insert_one(multiplex_data).inserted_id

#     logger.info("New Multiplex Inserted : ID ({0})".format(str(multiplex_id)))

#     return jsonify({"multiplex_id": str(multiplex_id)})


# @theater_employee.route('/api/theater_employee/get_multiplexes', methods=['GET'])
# @check_auth(roles=["Admin"])
# def get_multiplexes(*args, **kwargs):
#     response = []

#     multiplexes_cursor = cmpe202_db_client.multiplexes.find({
#         "$or": [
#             {"deleted": {"$exists": False}},
#             {"deleted": False}
#         ]
#     })

#     for rec in multiplexes_cursor:
#         clean_obj(rec)
#         response.append(rec)

#     return jsonify(response)


# @theater_employee.route('/api/theater_employee/delete_multiplex/<multiplex_id>', methods=['DELETE'])
# @check_auth(roles=["Admin"])
# def delete_multiplex(multiplex_id, *args, **kwargs):

#     cmpe202_db_client.multiplexes.update_one(
#         {'_id': ObjectId(multiplex_id)}, {"$set": {"deleted": True}})

#     logger.info("Multiplex Deleted : ID ({0})".format(str(multiplex_id)))

#     return jsonify({"message": "Multiplex Deletion Successfull"})


# Expects in body: "name" (str), "location_id" (str), "seating capacity" (int)
@theater_employee.route('/api/theater_employee/insert_theater', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_theater(*args, **kwargs):
    data = request.get_json()

    if "name" in data:
        theater_name = data["name"]
    else:
        return abort(make_response(jsonify(error=f"Please Provide Theater Name"), 400))

    if "location_id" in data:
        location_id = ObjectId(data["location_id"])
    else:
        return abort(make_response(jsonify(error=f"Please Provide Location Id"), 400))

    if "seating_capacity" in data:
        seating_capacity = data["seating_capacity"]
    else:
        return abort(make_response(jsonify(error=f"Please Provide Seating Capacity"), 400))
      
    theater_data = {
        "name": theater_name,
        "location_id": location_id,
        "seating_capacity": seating_capacity,
        "added_date": datetime.datetime.utcnow(),
        "added_by": kwargs["user"]
    }
    theater_id = cmpe202_db_client.theaters.insert_one(
        theater_data).inserted_id

    logger.info("New Theater Inserted : ID ({0})".format(str(theater_id)))

    return jsonify({"theater_id": str(theater_id)})


@theater_employee.route('/api/theater_employee/get_theaters', methods=['GET'])
@check_auth(roles=["Admin"])
def get_theaters(*args, **kwargs):
    theaters = list(cmpe202_db_client.theaters.find({
        "$or": [
            {"deleted": {"$exists": False}},
            {"deleted": False}
        ]
    }))

    clean_list(theaters)
    return jsonify(theaters)


# Expects in body: "name" (str) (opt) or "seating_capacity" (int) (opt)
@theater_employee.route('/api/theater_employee/update_theater/<theater_id>', methods=['PATCH'])
@check_auth(roles=["Admin"])
def update_theater(theater_id, *args, **kwargs):
    data = request.get_json()

    update_data = {}

    if "name" in data:
        update_data["name"] = data["name"]

    if "seating_capacity" in data:
        update_data["seating_capacity"] = data["seating_capacity"]

    cmpe202_db_client.theaters.update_one(
        {"_id": ObjectId(theater_id)},
        {"$set": update_data}
    )

    logger.info("Updated metadata of Theater : ID ({0})".format(theater_id))

    return jsonify({"message": "Theater Update Successfull"})


@theater_employee.route('/api/theater_employee/delete_theater/<theater_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_theater(theater_id, *args, **kwargs):

    cmpe202_db_client.theaters.update_one(
        {'_id': ObjectId(theater_id)}, {"$set": {"deleted": True}})

    logger.info("Theater Deleted : ID ({0})".format(str(theater_id)))

    return jsonify({"message": "Theater Deletion Successfull"})


# Expects in body: "seating_capacity" (int)
@theater_employee.route('/api/theater_employee/update_theater_seatings/<theater_id>', methods=['PUT'])
@check_auth(roles=["Admin"])
def update_theater_seatings(theater_id, *args, **kwargs):
    data = request.get_json()

    if "seating_capacity" in data:
        seating_capacity = data["seating_capacity"]
    else:
        return abort(make_response(jsonify(error=f"Please Provide Seating Capacity"), 400))
    
    cmpe202_db_client.theaters.update_one(
        {"_id": ObjectId(theater_id)},
        {"$set": {
            "seating_capacity": seating_capacity
        }}
    )

    logger.info("Theater Seating Updated : ID ({0})".format(str(theater_id)))

    return jsonify({"message": "Theater Seating Updation Successfull"})

# Adds a new discount
# Expects in body: "percentage" (int) (0-100), "day" (int) (0-6, optional), "start_hour" (int) (0-24, optional), "end_hour" (int) (0-24, optional),
# "start_date" (str) (ISO 8601 datetime format, optional), "end_date" (str) (ISO 8601 datetime format, optional)
# Can do discount by day, time, or combined. No start date means starts immediately, no end date means end in 365 days


# @theater_employee.route('/api/theater_employee/insert_discount', methods=['POST'])
# @check_auth(roles=["Admin"])
# def insert_discount(*args, **kwargs):
#     data = request.get_json()

#     discount_data = {
#         "percentage": data["percentage"],
#         "added_date": datetime.datetime.utcnow(),
#         "added_by": kwargs["user"]
#     }
#     if "day" in data:
#         discount_data["day"] = data["day"]

#     if "start_hour" in data:
#         discount_data["start_hour"] = data["start_hour"]

#     if "end_hour" in data:
#         discount_data["end_hour"] = data["end_hour"]

#     if "start_date" in data:
#         discount_data["start_date"] = jsdate_to_datetime(data["start_date"])
#     else:
#         discount_data["start_date"] = datetime.datetime.utcnow()

#     if "end_date" in data:
#         discount_data["end_date"] = jsdate_to_datetime(data["end_date"])
#     else:
#         discount_data["end_date"] = datetime.datetime.utcnow() + \
#             datetime.timedelta(days=365)

#     discount_id = cmpe202_db_client.discounts.insert_one(
#         discount_data).inserted_id

#     logger.info("New discount Inserted : ID ({0})".format(str(discount_id)))

#     return jsonify({"discount_id": str(discount_id)})


# Returns all discounts
# @theater_employee.route('/api/theater_employee/get_discounts', methods=['GET'])
# @check_auth(roles=["Admin"])
# def get_discounts(*args, **kwargs):
#     discounts = list(cmpe202_db_client.discounts.find({
#         "$or": [
#             {"deleted": {"$exists": False}},
#             {"deleted": False}
#         ]
#     }))

#     clean_list(discounts)
#     return jsonify(discounts)


# Adds a new discount
# Expects in body: "percentage" (int) (0-100, opt), "day" (int) (0-6, opt), "start_hour" (int) (0-24, opt), "end_hour" (int) (0-24, opt),
# "start_date" (str) (ISO 8601 datetime format, opt), "end_date" (str) (ISO 8601 datetime format, opt)
# Can do discount by day, time, or combined. No start date means starts immediately, no end date means end in 365 days
@theater_employee.route('/api/theater_employee/update_discount/<showtime_id>', methods=['PATCH'])
@check_auth(roles=["Admin"])
def update_discount(showtime_id, *args, **kwargs):
    data = request.get_json()

    discount_data = {}

    if "percentage" in data:
        discount_data["percentage"] = data["percentage"]

    discount_data["modified_date"] = datetime.datetime.utcnow()
    discount_data["modified_by"] = kwargs["user"]
    
    # if "day" in data:
    #     discount_data["day"] = data["day"]

    # if "start_hour" in data:
    #     discount_data["start_hour"] = data["start_hour"]

    # if "end_hour" in data:
    #     discount_data["end_hour"] = data["end_hour"]

    # if "start_date" in data:
    #     discount_data["start_date"] = jsdate_to_datetime(data["start_date"])

    # if "end_date" in data:
    #     discount_data["end_date"] = jsdate_to_datetime(data["end_date"])

    cmpe202_db_client.discounts.update_one(
        {"showtime_id": ObjectId(showtime_id)},
        {"$set": discount_data}
    )

    logger.info("Updated Discount with Showtime : ID ({0})".format(showtime_id))

    return jsonify({"message": "Discount Update Successfull"})


# Soft deletes a given discount
@theater_employee.route('/api/theater_employee/delete_discount/<discount_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_discount(discount_id, *args, **kwargs):

    cmpe202_db_client.discounts.update_one(
        {'_id': ObjectId(discount_id)}, {"$set": {"deleted": True}})

    logger.info("discount Deleted : ID ({0})".format(str(discount_id)))

    return jsonify({"message": "discount Deletion Successfull"})


# Expects in body: "theater_id" (str), "movie_id" (str), "show_date" (str) (ISO 8601 datetime format)
@theater_employee.route('/api/theater_employee/insert_showtime', methods=['POST'])
@check_auth(roles=["Admin"])
def insert_showtimes(*args, **kwargs):
    data = request.get_json()

    if "theater_id" in data:
        theater_id = ObjectId(data["theater_id"])
    else:
        return abort(make_response(jsonify(error=f"Please Provide Theater Id"), 400))
    
    if "movie_id" in data:
        movie_id = ObjectId(data["movie_id"])
    else:
        return abort(make_response(jsonify(error=f"Please Provide Movie Id"), 400))
    
    if "show_date" in data:
        show_date = jsdate_to_datetime(data["show_date"])
        show_day = calendar.day_name[show_date.weekday()]
    else:
        return abort(make_response(jsonify(error=f"Please Provide Show Date"), 400))
    
    showtime_data = {
        "theater_id": theater_id,
        "movie_id": movie_id,
        "show_date": show_date,
        "show_day": show_day,
        "added_date": datetime.datetime.utcnow(),
        "added_by": kwargs["user"],
        "price": 20
    }
    showtime_id = cmpe202_db_client.showtimes.insert_one(
        showtime_data).inserted_id

    logger.info("New Showtime Inserted : ID ({0})".format(str(showtime_id)))

    if show_day.upper() == "TUESDAY" or show_date.hour < 18:
        discount_data = {
            "showtime_id": showtime_id,
            "added_date": datetime.datetime.utcnow(),
            "added_by": kwargs["user"],
            "percentage": 0
        }
        discount_id = cmpe202_db_client.discounts.insert_one(
        discount_data).inserted_id
        logger.info("New Discount Inserted : ID ({0})".format(str(discount_id)))

    return jsonify({"showtime_id": str(showtime_id)})

    # data = request.get_json()

    # showtime_ids = []
    # show_days = dict(data["show_days"])
    # for show_day_rec in show_days:
    #     show_day_timestamp = datetime.datetime.strptime(show_day_rec["show_day_timestamp"], "%d%b%Y%H%M%S")
    #     show_day = calendar.day_name[show_day_timestamp.weekday()]
    #     for show_time in show_day_rec["show_times"]:
    #         showtime_data = {
    #             "theater_id": ObjectId(data["theater_id"]),
    #             "movie_id": data["movie_id"],
    #             "show_date": datetime.datetime.strptime(show_day_timestamp, "%d%b%Y%H%M%S"),
    #             "seating_capacity": data["seating_capacity"],
    #             "created": datetime.datetime.utcnow(),
    #             "discount_criteria": data["discount_criteria"],
    #             "user": kwargs["user"],
    #             "seats_filled": 0
    #         }

    #         showtime_id = cmpe202_db_client.showtimes.insert_one(showtime_data).inserted_id
    #         showtime_ids.append(str(showtime_id))
    #         logger.info("New Showtime Inserted : ID ({0})".format(str(showtime_id)))

    # return jsonify({"showtime_ids": showtime_ids})


@theater_employee.route('/api/theater_employee/get_showtimes', methods=['GET'])
@check_auth(roles=["Admin"])
def get_showtimes(*args, **kwargs):
    showtimes = list(cmpe202_db_client.showtimes.aggregate(
        [
            {"$addFields": {
                "hour_of_day": {"$hour": "$show_date"}
            }},
            {"$match": {
                "$and": [
                    {"$or": [
                        {"deleted": {"$exists": False}},
                        {"deleted": False}
                    ]}
                ]
            }}
        ]
    ))

    clean_list(showtimes)
    return jsonify(showtimes)

# Expects in body: "show_date" (str) (ISO 8601 datetime format)


@theater_employee.route('/api/theater_employee/update_showtime/<showtime_id>', methods=['PATCH'])
@check_auth(roles=["Admin"])
def update_showtime(showtime_id, *args, **kwargs):
    data = request.get_json()

    update_data = {}

    if "show_date" in data:
        show_date = jsdate_to_datetime(data["show_date"])
        update_data["show_date"] = show_date

        show_day = calendar.day_name[jsdate_to_datetime(show_date).weekday()]
        update_data["show_day"] = show_day
    else:
        return abort(make_response(jsonify(error=f"Please Provide Show Date"), 400))

    cmpe202_db_client.showtimes.update_one(
        {"_id": ObjectId(showtime_id)},
        {"$set": update_data}
    )

    if show_day.upper() == "TUESDAY" or show_date.hour < 18:
        count = cmpe202_db_client.discounts.count_documents({
            'showtime_id': ObjectId(showtime_id),
            "$or": [
                {"deleted": {"$exists": False}},
                {"deleted": False}
            ]
        })
        if count == 0:
            discount_data = {
                "showtime_id": ObjectId(showtime_id),
                "added_date": datetime.datetime.utcnow(),
                "added_by": kwargs["user"],
                "percentage": 0
            }
            discount_id = cmpe202_db_client.discounts.insert_one(
            discount_data).inserted_id
            logger.info("New Discount Inserted : ID ({0})".format(str(discount_id)))
    else:
        cmpe202_db_client.discounts.update_one(
            {'showtime_id': ObjectId(showtime_id)}, {"$set": {"deleted": True}})

    logger.info("Showtime Updated : ID ({0})".format(str(showtime_id)))

    return jsonify({"message": "Showtime Update Successful"})


@theater_employee.route('/api/theater_employee/delete_showtime/<showtime_id>', methods=['DELETE'])
@check_auth(roles=["Admin"])
def delete_showtime(showtime_id, *args, **kwargs):

    cmpe202_db_client.showtimes.update_one(
        {'_id': ObjectId(showtime_id)}, {"$set": {"deleted": True}})

    logger.info("Showtime Deleted : ID ({0})".format(str(showtime_id)))

    return jsonify({"message": "Showtime Deletion Successfull"})


@theater_employee.route('/api/theater_employee/get_showtimes_custom', methods=['GET'])
@check_auth(roles=["Admin"])
def get_showtimes_custom(*args, **kwargs):
    showtimes_custom = list(cmpe202_db_client.showtimes.aggregate(
        [
            {"$addFields": {
                "hour_of_day": {"$hour": "$show_date"}
            }},
            {"$match": {
                "$and": [
                    {"$or": [
                        {"deleted": {"$exists": False}},
                        {"deleted": False}
                    ]},
                    {"$or": [
                        {"show_day": "Tuesday"},
                        {"hour_of_day": {"$lt": 18}}
                    ]}
                ]
            }},
            {"$lookup": {
                "from": "discounts",
                "localField": "_id",
                "foreignField": "showtime_id",
                "as": "discount_data",
            }},
            {"$unwind": {
                "path": "$discount_data", "preserveNullAndEmptyArrays": True}
            },
            {"$addFields": {
              "price": {
                "$cond": {
                  "if": {"$eq": [{"$ifNull": ["$price", None]}, None]},
                  "then": int(20),
                  "else": "$price"
                }
              },
              "discount_percentage": {
                "$cond": {
                  "if": {"$eq": [{"$ifNull": ["$discount_data", None]}, None]},
                  "then": int(0),
                  "else": "$discount_data.percentage"
                }
              }
            }},
            {"$project": {"discount_data": 0}}
        ]
    ))

    clean_list(showtimes_custom)

    return jsonify(showtimes_custom)


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
