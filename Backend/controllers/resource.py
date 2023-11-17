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
def login_old():
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

@resource.route('/api/create_account_old', methods=['POST'])
def create_account_old():
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


#Adds showtime["movie"] to each showtime
def add_movie_to_showtimes(showtimes):
    for show in showtimes:
        show["movie"] = cmpe202_db_client.movies.find_one({"_id": show["movie_id"]})


#Returns the number of remaining seats in showtime, expects ObjectId
def get_remaining_seats(showtime_id):
    try:
        theater_id = cmpe202_db_client.showtimes.find_one({"_id": showtime_id})["theater_id"]
    except(Exception):
        return jsonify({"message": "Bad showtime ID"}), 400

    theater_seats = cmpe202_db_client.theaters.find_one({"_id": theater_id})["seating_capacity"]

    #Probably a better way to get just the sum value out of this
    tmp = list(cmpe202_db_client.tickets.aggregate([{
        "$match": {"showtime_id": showtime_id}},
        {"$group": {
            "_id": "null",
            "sum": {"$sum": "$ticket_count"}
        }}]))
    used_seats = tmp[0]["sum"] if tmp else 0
    
    return theater_seats - used_seats


#Calculates the price of a showtime based on active discounts
def get_active_price(showtime_id):
    try:
        show_date = cmpe202_db_client.showtimes.find_one({"_id": showtime_id})["show_date"]
    except(Exception):
        return jsonify({"message": "Bad showtime ID"}), 400
    
    #Probably a better way to get just the sum value out of this
    tmp = list(cmpe202_db_client.discounts.aggregate([{
        "$match": {
            "$and": [
                {"$or": [
                    {"deleted": {"$exists": False}},
                    {"deleted": False}
                ]},
                {"start_date": {
                    "$lte": show_date
                }},
                {"end_date": {
                    "$gte": show_date
                }},
                {"$or": [
                    {"day": {"$exists": False}},
                    {"day": show_date.weekday()}
                ]},
                {"$or": [
                    {"start_hour": {"$exists": False}},
                    {"start_hour": {
                        "$lte": show_date.time().hour}
                    }
                ]},
                {"$or": [
                    {"end_hour": {"$exists": False}},
                    {"end_hour": {
                        "$gte": show_date.time().hour}
                    }
                ]}
            ]
        }},
        {"$group": {
            "_id": "null",
            "sum": {"$sum": "$percentage"}
        }}]))
    discount = tmp[0]["sum"] if tmp else 0
    if discount > 100:
        discount = 100

    price = 20.0

    return price - (price * discount / 100) if discount else price



@resource.route('/api/testadd', methods=['GET'])
def get_ddshowtimes():
    return jsonify({"message": get_active_price(ObjectId("6555ccc14a63291ca6a10162"))}), 200

#TODO: remove once db is set
@resource.route('/api/cleandb', methods=['DELETE'])
def get_showtsdfsdfimes():
    #cmpe202_db_client.users.delete_many({})
    #cmpe202_db_client.movies.delete_many({})
    #cmpe202_db_client.locations.delete_many({})
    #cmpe202_db_client.theaters.delete_many({})
    cmpe202_db_client.discounts.delete_many({})
    #cmpe202_db_client.showtimes.delete_many({})
    #cmpe202_db_client.tickets.delete_many({})

    return jsonify(""), 200


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

    clean_list(locations)
    return jsonify(locations), 200


#Buys a number of tickets for a given showtime
#Body expected: showtime_id (string), ticket_count (int), use_reward (boolean) (opt)
@resource.route('/api/buy_ticket', methods=['POST'])
@set_token_vars()
def buy_tickets(*args, **kwargs):
    val = request.get_json()

    if "user_id" in kwargs:
        user_id = kwargs["user_id"]
        if ("ticket_count" in val):
            ticket_count = val["ticket_count"]
        else:
            ticket_count = 1
    else:
        user_id = None
        ticket_count = 1

    if ("showtime_id" in val):
            showtime_id = val["showtime_id"]
    else:
        return jsonify({"message": "Missing showtime_id"}), 400
    
    if (ticket_count > 8):
        return jsonify({"message": "Only 8 tickets max"}), 400

    if get_remaining_seats(ObjectId(showtime_id)) - ticket_count < 0:
        return jsonify({"message": "Can't book more tickets than available seats"}), 409
    

    fee = 1.5
    ticket = {
        "showtime_id": ObjectId(showtime_id),
        "ticket_count": ticket_count,
        "paid": (get_active_price(ObjectId(showtime_id)) * ticket_count) + fee
    }

    if user_id:
        ticket["user_id"] = user_id
        if kwargs["is_member"]:
            ticket["paid"] -= fee
        if "use_reward" in val and val["use_reward"]:
            if kwargs["points"] < ticket["paid"]:
                return jsonify({"message": "Not enough points, can't afford", "price": ticket["paid"]}), 409
            
            cmpe202_db_client.users.update_one(
                {"_id": user_id},
                {"$set": {
                    "points": kwargs["points"] - ticket["paid"]
                }
            })
        else:
            cmpe202_db_client.users.update_one(
                {"_id": user_id},
                {"$set": {
                    "points": kwargs["points"] + ticket["paid"]
                }
            })

    cmpe202_db_client.tickets.insert_one(ticket)

    clean_obj(ticket)
    return jsonify(ticket), 201


#Returns the tickets registered for given user, if admin
@resource.route('/api/user_tickets/<check_user_id>', methods=['GET'])
@check_auth(roles=["Admin"])
def get_user_tickets_admin(check_user_id, *args, **kwargs):
    tickets = list(cmpe202_db_client.tickets.find({"user_id": ObjectId(check_user_id)}))
    if not tickets:
        return jsonify({"message": "No tickets for user found"}), 404
    add_showtime_to_tickets(tickets)

    clean_list(tickets)
    return jsonify(tickets), 200


#Returns the tickets registered to current user
@resource.route('/api/user_tickets', methods=['GET'])
@check_auth()
def get_user_tickets(*args, **kwargs):
    tickets = list(cmpe202_db_client.tickets.find({"user_id": kwargs["user_id"]}))
    if not tickets:
        return jsonify({"message": "No tickets for user found"}), 404
    add_showtime_to_tickets(tickets)

    clean_list(tickets)
    return jsonify(tickets), 200


#Returns the tickets registered to current user for showtimes that have already happened
@resource.route('/api/prev_user_tickets', methods=['GET'])
@check_auth()
def get_prev_user_tickets(*args, **kwargs):
    tickets = list(cmpe202_db_client.tickets.find({"user_id": kwargs["user_id"]}))
    if not tickets:
        return jsonify({"message": "No tickets for user found"}), 404

    cur_date = datetime.utcnow()
    prev_tickets = []
    for ticket in tickets:
        tmp = cmpe202_db_client.showtimes.find_one({
            "_id": ticket["showtime_id"], 
            "show_date": {
                "$lte": cur_date
            }})
        if tmp:
            ticket["showtime"] = tmp
            prev_tickets.append(ticket)
    
    if not prev_tickets:
        return jsonify({"message": "No movies watched"}), 404
    
    for ticket in prev_tickets:
        ticket["showtime"]["movie"] = cmpe202_db_client.movies.find_one({"_id": ticket["showtime"]["movie_id"]})

    clean_list(prev_tickets)
    return jsonify(prev_tickets), 200


#Returns the tickets registered to current user for showtimes that have not yet happened
@resource.route('/api/future_user_tickets', methods=['GET'])
@check_auth()
def get_future_user_tickets(*args, **kwargs):
    tickets = list(cmpe202_db_client.tickets.find({"user_id": kwargs["user_id"]}))
    if not tickets:
        return jsonify({"message": "No tickets for user found"}), 404

    cur_date = datetime.utcnow()
    future_tickets = []
    for ticket in tickets:
        tmp = cmpe202_db_client.showtimes.find_one({
            "_id": ticket["showtime_id"], 
            "show_date": {
                "$gte": cur_date
            }})
        if tmp:
            ticket["showtime"] = tmp
            future_tickets.append(ticket)
    
    if not future_tickets:
        return jsonify({"message": "No movies to be watched"}), 404
    
    for ticket in future_tickets:
        ticket["showtime"]["movie"] = cmpe202_db_client.movies.find_one({"_id": ticket["showtime"]["movie_id"]})

    clean_list(future_tickets)
    return jsonify(future_tickets), 200


#Refunds a ticket for current user
@resource.route('/api/user_ticket/<ticket_id>', methods=['DELETE'])
@check_auth()
def delete_ticket(ticket_id, *args, **kwargs):
    ticket = cmpe202_db_client.tickets.find_one({"user_id": kwargs["user_id"], "_id": ObjectId(ticket_id)})
    if not ticket:
        return jsonify({"message": "Requested ticket not found or doesn't belong to user"}), 404
    
    showtime = cmpe202_db_client.showtimes.find_one({"_id": ticket["showtime_id"]})
    if not showtime:
        return jsonify({"message": "Requested ticket is invalid, no linked showtime"}), 404
    
    if showtime["show_date"] < datetime.utcnow():
        return jsonify({"message": "Can't refund tickets for showings that have already begun"}), 409

    if (cmpe202_db_client.tickets.delete_one({"user_id": kwargs["user_id"], "_id": ObjectId(ticket_id)}).deleted_count):
        cmpe202_db_client.users.update_one(
            {"_id": kwargs["user_id"]},
            {"$set": {
                "points": kwargs["points"] - ticket["paid"]
            }
        })

        return jsonify({"message": "Success"}), 204
    else:
        return jsonify({"message": "Something broke, ticket was found but deletion failed"}), 500


#Returns all showtimes for user within past 30 days, including movie data
@resource.route('/api/recent_movies', methods=['GET'])
@check_auth()
def get_recent_movies(*args, **kwargs):
    tickets = list(cmpe202_db_client.tickets.find({"user_id": kwargs["user_id"]}))
    if not tickets:
        return jsonify({"message": "No tickets for user found"}), 404

    cur_date = datetime.utcnow()
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
        return jsonify({"message": "No movies watched within the past 30 days"}), 404
    add_movie_to_showtimes(showtimes)

    clean_list(showtimes)
    return jsonify(showtimes), 200


#Makes the current user a VIP member for 365 days from now (we get slightly more money for value on leap years!)
#If already VIP, simply overwrites the end date and the remaining time is wasted.
@resource.route('/api/buy_vip', methods=['PATCH'])
@check_auth()
def buy_vip(*args, **kwargs):
    #Pretending to have payment stuff
    paid = True
    if (not paid):
        return jsonify({"message": "Too poor"}), 403
    
    vip_until = datetime.utcnow() + timedelta(days=365)
    
    cmpe202_db_client.users.update_one(
        {"_id": kwargs["user_id"]},
        {"$set": {"vip_until": vip_until}}
        )
    
    ret = {
        "vip_until": vip_until.isoformat()
    }

    return jsonify(ret), 200


#Returns the showtimes for a given movie
@resource.route('/api/movie/<movie_id>', methods=['GET'])
def get_movie_showtimes(movie_id):
    showtimes = list(cmpe202_db_client.showtimes.find({"movie_id": ObjectId(movie_id)}))
    if not showtimes:
        return jsonify({"message": "No showtimes for movie found"}), 404
    
    full = []
    for showtime in showtimes:
        if get_remaining_seats(showtime["_id"]) > 0:
            del showtime["movie_id"]
            showtime["price"] = get_active_price(showtime["_id"])
        else:
            full.append(showtime)

    for x in full:
        showtimes.remove(x)

    if not showtimes:
        return jsonify({"message": "No showtimes for movie found"}), 404

    clean_list(showtimes)
    return jsonify(showtimes), 200


#Returns upcoming movies (no showtime or > 1 month out)
@resource.route('/api/upcoming_movies', methods=['GET'])
def get_upcoming_movies():
    movies = list(cmpe202_db_client.movies.find({}))
    upcoming = []
    future = datetime.utcnow() + timedelta(days=30)
    for movie in movies:
        showtime = cmpe202_db_client.showtimes.find_one({
            "movie_id": movie["_id"],
            "show_date": {
                "$lte": future
            }
        })
        if not showtime:
            upcoming.append(movie)

    clean_list(upcoming)
    return jsonify(upcoming), 200


#Returns movies by theater
@resource.route('/api/theater/<theater_id>/movies', methods=['GET'])
def get_movies_by_theater(theater_id):
    showtimes = list(cmpe202_db_client.showtimes.find({"theater_id": ObjectId(theater_id)}))
    if not showtimes:
        return jsonify({"message": "No showtimes for theater found"}), 404
    
    movies = []
    for show in showtimes:
        movies.append(cmpe202_db_client.movies.find_one({"_id": show["movie_id"]}))

    clean_list(movies)
    return jsonify(movies), 200


#Returns showtimes by theater
@resource.route('/api/theater/<theater_id>', methods=['GET'])
def get_showtimes_by_theater(theater_id):
    showtimes = list(cmpe202_db_client.showtimes.find({"theater_id": ObjectId(theater_id)}))
    if not showtimes:
        return jsonify({"message": "No showtimes for theater found"}), 404
    
    for showtime in showtimes:
        del showtime["theater_id"]

    clean_list(showtimes)
    return jsonify(showtimes), 200