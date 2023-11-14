from bson.objectid import ObjectId
from flask import Blueprint, jsonify, request

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger
from util.helper import check_auth, set_token_vars, clean_list, clean_obj
from datetime import datetime, timedelta


resource = Blueprint('resource', __name__)
cmpe202_db_client = DBServiceInitializer.get_db_instance(__name__).get_collection_instance(app_config.db_name)
logger = AppLogger.getInstance(__name__).getLogger()


@resource.route('/api/get_movie_showtimes', methods=['GET'])
@check_auth(roles=[])
def fetch_movie_showtimes():

    rec = cmpe202_db_client.dummy.find_one({})

    dummy = {
        "id": str(rec["_id"]),
        "message": rec["message"]
    }
    logger.info("Testing dummy {0}".format(dummy))

    return jsonify(dummy)


@resource.route('/api/login_old', methods=['POST'])
def login():
    try:
        val = request.get_json()
        # check if username exists in the database
        user = cmpe202_db_client.account.find_one({"username": val["username"]})

        if user and user["password"] == val["password"]:
            # Convert ObjectId to string before returning the user object
            user["_id"] = str(user["_id"])
            response_data = {
                "message": "Successful",
                "user": user
            }
            return jsonify(response_data), 200

        return jsonify({"message": "Unsuccessful"}), 400

    except Exception as e:
        # Log the exception for debugging
        print(f"An error occurred: {str(e)}")
        return jsonify({"message": "Internal Server Error"}), 500

@resource.route('/api/create_account', methods=['POST'])
def create_account():
    val = request.get_json()

    # check if username does not exist in database
    userExists = cmpe202_db_client.users.find_one({"username": val["username"]})
    if userExists:
        return jsonify({"message": "Unsuccesful"}), 400

    cmpe202_db_client.users.insert_one(val)
    return jsonify({"message": "Successful"}), 201


#Adds theater["showtimes"] to each theater
def add_showtimes_to_theaters(theaters):
    for theater in theaters:
        theater["showtimes"] = list(cmpe202_db_client.showtimes.find({"theater_id": theater["_id"]}))


#Adds ticket["showtime"] to each ticket
def add_showtime_to_tickets(tickets):
    for ticket in tickets:
        ticket["showtime"] = cmpe202_db_client.showtimes.find_one({"_id": ticket["showtime_id"]})


#Returns the number of remaining seats in showtime, expects ObjectId
def get_remaining_seats(showtime_id):
    try:
        theater_id = cmpe202_db_client.showtimes.find_one({"_id": showtime_id})["theater_id"]
    except(Exception):
        return "Bad showtime ID", 400

    theater_seats = cmpe202_db_client.theaters.find_one({"_id": theater_id})["seating_capacity"]

    #OPTIMIZE
    tmp = list(cmpe202_db_client.ticket.aggregate([{
        "$match": {"showtime_id": showtime_id}},
        {"$group": {
            "_id": "null",
            "sum": {"$sum": "$ticket_count"}
        }}]))
    used_seats = tmp[0]["sum"] if tmp else 0
    
    return theater_seats - used_seats


# @resource.route('/api/testadd', methods=['GET'])
# def get_ddshowtimes():
#     showtime = {
#         "movie_id": ObjectId("654b100e843cc2a163b985fc"),
#         "theater_id": ObjectId("65531f0438e5bb69d4e31b0d"),
#         "show_date": datetime(2023, 11, 10)
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime)

#     showtime2 = {
#         "movie_id": ObjectId("654b107a843cc2a163b98605"),
#         "theater_id": ObjectId("65531f0438e5bb69d4e31b0d"),
#         "show_date": datetime(2023, 11, 10)
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime2)

#     showtime3 = {
#         "movie_id": ObjectId("654b107a843cc2a163b98605"),
#         "theater_id": ObjectId("65531f0438e5bb69d4e31b0d"),
#         "show_date": datetime(2023, 11, 11)
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime3)

#     showtime4 = {
#         "movie_id": ObjectId("654b107a843cc2a163b98605"),
#         "theater_id": ObjectId("65531f0438e5bb69d4e31b0d"),
#         "show_date": datetime(2023, 11, 18)
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime4)

#     return "", 200


#Returns all showtimes
@resource.route('/api/showtimes', methods=['GET'])
def get_showtimes():
    showtimes = list(cmpe202_db_client.showtimes.find({}))

    clean_list(showtimes)
    return jsonify(showtimes), 200


#Returns theaters and their showtimes, search by location_id 
@resource.route('/api/theaters/<location_id>', methods=['GET'])
def get_theaters_by_location(location_id):
    theaters = list(cmpe202_db_client.theaters.find({"location_id": ObjectId(location_id)}))
    add_showtimes_to_theaters(theaters)

    clean_list(theaters)
    return jsonify(theaters), 200


#Returns all locations, their theaters, and their showtimes
@resource.route('/api/all_locations', methods=['GET'])
def get_all_locations():
    locations = list(cmpe202_db_client.locations.find({}))
    for location in locations:
        location["theaters"] = list(cmpe202_db_client.theaters.find({"location_id": location["_id"]}))
        add_showtimes_to_theaters(location["theaters"])

    clean_list(locations)
    return jsonify(locations), 200


#Buys a number of tickets for a given showtime
#Body expected: showtime_id (string), ticket_count (int)
@resource.route('/api/buy_ticket', methods=['POST'])
@set_token_vars()
def buy_tickets(*args, **kwargs):
    val = request.get_json()

    if "user" in kwargs:
        user_id = kwargs["user_id"]
        if ("ticket_count" in val):
            ticket_count = val["ticket_count"]
        else:
            ticket_count = 1
    else:
        user_id = "0"
        ticket_count = 1

    if ("showtime_id" in val):
            showtime_id = val["showtime_id"]
    else:
        return "Missing showtime_id", 400
    
    if (ticket_count > 8):
        return "Only 8 tickets max", 400

    if get_remaining_seats(ObjectId(showtime_id)) - ticket_count < 0:
        return "Can't book more tickets than available seats", 409
    
    #TODO: charge user for movie
    paid = True
    if (not paid):
        return jsonify({"message": "Too poor"}), 403

    ticket = {
        "user_id": ObjectId(user_id),
        "showtime_id": ObjectId(showtime_id),
        "ticket_count": ticket_count
    }

    cmpe202_db_client.ticket.insert_one(ticket)

    clean_obj(ticket)
    return jsonify(ticket), 201


#Returns the tickets registered for given user, if admin
@resource.route('/api/user_tickets/<check_user_id>', methods=['GET'])
@check_auth(roles=["Admin"])
def get_user_tickets_admin(check_user_id, *args, **kwargs):
    tickets = list(cmpe202_db_client.ticket.find({"user_id": ObjectId(check_user_id)}))
    add_showtime_to_tickets(tickets)

    clean_list(tickets)
    return jsonify(tickets), 200


#Returns the tickets registered to current user
@resource.route('/api/user_tickets', methods=['GET'])
@check_auth()
def get_user_tickets(*args, **kwargs):
    tickets = list(cmpe202_db_client.ticket.find({"user_id": ObjectId(kwargs["user_id"])}))
    add_showtime_to_tickets(tickets)

    clean_list(tickets)
    return jsonify(tickets), 200


#Refunds a ticket for current user
@resource.route('/api/user_ticket/<ticket_id>', methods=['DELETE'])
@check_auth()
def delete_ticket(ticket_id, *args, **kwargs):
    #TODO: verify showtime time hasn't passed

    if (cmpe202_db_client.ticket.delete_one({"user_id": ObjectId(kwargs["user_id"]), "_id": ObjectId(ticket_id)}).deleted_count):
        #TODO: give refund to user
        return "", 204
    else:
        return jsonify({"message": "Requested ticket not found or doesn't belong to user"}), 400


#Returns all showtimes for user within past 30 days, including movie data
@resource.route('/api/recent_movies', methods=['GET'])
@check_auth()
def get_recent_movies(*args, **kwargs):
    tickets = list(cmpe202_db_client.ticket.find({"user_id": ObjectId(kwargs["user_id"])}))
    if not tickets:
        return "No tickets for user found", 404

    cur_date = datetime.now()
    past_date = cur_date - timedelta(days=30)
    showtimes = []
    for ticket in tickets:
        tmp = cmpe202_db_client.showtimes.find_one({
            "_id": ticket["showtime_id"], 
            "show_date": {
                "$gte": past_date,
                "$lte": cur_date
            }})
        if tmp:
            showtimes.append(tmp)
    
    if not showtimes:
        return "No movies watched within the past 30 days", 404
    
    for show in showtimes:
        show["movie"] = cmpe202_db_client.movies.find_one({"_id": show["movie_id"]})

    clean_list(showtimes)
    return jsonify(showtimes), 200