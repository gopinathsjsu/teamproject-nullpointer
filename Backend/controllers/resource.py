from bson.objectid import ObjectId
from flask import Blueprint, jsonify, request

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger
from util.helper import check_auth, set_token_vars, clean_list, clean_obj


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


#Returns all showtimes
@resource.route('/api/showtimes', methods=['GET'])
def get_showtimes():
    showtimes = list(cmpe202_db_client.showtimes.find({}))
    
    clean_list(showtimes)
    return jsonify(showtimes), 200


#Adds theater["showtimes"] to each theater
def add_showtimes_to_theaters(theaters):
    for theater in theaters:
        theater["showtimes"] = list(cmpe202_db_client.showtimes.find({"theater_id": theater["_id"]}))


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


# @resource.route('/api/testadd', methods=['GET'])
# def get_ddshowtimes():
#     location = {
#         "name": "Milpitas"
#     }
#     cmpe202_db_client.locations.insert_one(location)

#     theater = {
#         "name": "Testing Theater3",
#         "seating_capacity": 10,
#         "location_id": location["_id"]
#     }
#     cmpe202_db_client.theaters.insert_one(theater)

#     theater2 = {
#         "name": "Testing Theater4",
#         "seating_capacity": 8,
#         "location_id": location["_id"]
#     }
#     cmpe202_db_client.theaters.insert_one(theater2)

#     showtime = {
#         "movie_id": ObjectId("654b100e843cc2a163b985fc"),
#         "theater_id": theater["_id"]
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime)

#     showtime2 = {
#         "movie_id": ObjectId("654b107a843cc2a163b98605"),
#         "theater_id": theater2["_id"]
#     }
#     cmpe202_db_client.showtimes.insert_one(showtime2)

#     return "", 200


#Buys a number of tickets for a given showtime
#Body expected: showtime_id, ticket_count
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

    #TODO: Maybe update this to put it all into one nested query, no idea how to do that mongodb
    try:
        theater_id = cmpe202_db_client.showtimes.find_one({"_id": ObjectId(showtime_id)})["theater_id"]
    except(Exception):
        return "Bad showtime ID", 400

    theater_seats = cmpe202_db_client.theaters.find_one({"_id": ObjectId(theater_id)})["seating_capacity"]
    existing_tickets = list(cmpe202_db_client.ticket.find({"showtime_id": ObjectId(showtime_id)}))
    if existing_tickets:
        existing = 0
        for x in existing_tickets:
            existing += int(x["ticket_count"])
        if theater_seats - (existing + ticket_count) < 1:
            return "Can't book more tickets than available seats", 409
    
    #TODO: charge user for movie (premium check logic in there)
    paid = True
    if (not paid):
        return jsonify({"message": "Too poor"}), 403

    ticket = {
        "user_id": ObjectId(user_id),
        "showtime_id": ObjectId(showtime_id),
        "ticket_count": str(ticket_count)
    }

    cmpe202_db_client.ticket.insert_one(ticket)

    clean_obj(ticket)
    return jsonify(ticket), 201


#Returns the tickets registered for given user, if admin
@resource.route('/api/user_tickets/<check_user_id>', methods=['GET'])
@check_auth(roles=["Admin"])
def get_user_tickets_admin(check_user_id, *args, **kwargs):
    tickets = list(cmpe202_db_client.ticket.find({"user_id": ObjectId(check_user_id)}))

    clean_list(tickets)
    return jsonify(tickets), 200


#Returns the tickets registered to current user
@resource.route('/api/user_tickets', methods=['GET'])
@check_auth()
def get_user_tickets(*args, **kwargs):
    tickets = list(cmpe202_db_client.ticket.find({"user_id": ObjectId(kwargs["user_id"])}))

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
