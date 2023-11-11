from bson.objectid import ObjectId
from flask_api import status
from flask import Blueprint, jsonify, request

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger
from util.helper import check_auth


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


@resource.route('/api/login', methods=['POST'])
def login():
    val = request.get_json()
    # check if username exists in database
    userExists = cmpe202_db_client.account.find_one({"username": val["username"]})

    if userExists and userExists["password"] == val["password"]:
        return jsonify({"message": "Successful"}), status.HTTP_200_OK

    return jsonify({"message": "Unsuccessful"}), status.HTTP_400_BAD_REQUEST


@resource.route('/api/create_account', methods=['POST'])
def create_account():
    val = request.get_json()

    # check if username does not exist in database
    userExists = cmpe202_db_client.account.find_one({"username": val["username"]})
    if userExists:
        return jsonify({"message": "Unsuccesful"}), status.HTTP_400_BAD_REQUEST

    cmpe202_db_client.account.insert_one(val)
    return jsonify({"message": "Successful"})


#Buys a number of tickets for a given showing
#Body expected: showing_id, ticket_count
@resource.route('/api/buy_ticket', methods=['POST'])
def ticket():
    val = request.get_json()

    #TODO: verify user is logged in
    user_id = 1
    if ("user_id" in val):
        user_id = val["user_id"]

    #TODO: verify showing is legit and has enough open seats
    showing_id = 5
    if ("showing_id" in val):
        showing_id = val["showing_id"]

    ticket_count = 1
    if ("ticket_count" in val):
        ticket_count = val["ticket_count"]
    

    #TODO: charge user for movie (premium check logic in there) (include payment option)
    paid = True
    if (not paid):
        return jsonify({"message": "Too poor"}), 403

    #Could add seat selection, but let's see how things go
    ticket = {
        "user_id": str(user_id),
        "showing_id": str(showing_id),
        "ticket_count": str(ticket_count)
    }

    cmpe202_db_client.ticket.insert_one(ticket)

    #insert_one changes the given dict and adds _id (which breaks jsonify)
    ticket["_id"] = str(ticket["_id"])


    return jsonify(ticket), 201


#Returns the tickets registered for given user, if admin
@resource.route('/api/user_tickets/<user_id>', methods=['GET'])
def get_user_tickets_admin(user_id):
    #TODO: verify caller is admin

    tickets = list(cmpe202_db_client.ticket.find({"user_id": str(user_id)}))
    for x in tickets:
        x["_id"] = str(x["_id"])

    return jsonify(tickets), 200


#Returns the tickets registered to current user
@resource.route('/api/user_tickets', methods=['GET'])
def get_user_tickets():
    #TODO: verify user is logged in and get ID
    user_id = 1

    tickets = list(cmpe202_db_client.ticket.find({"user_id": str(user_id)}))
    for x in tickets:
        x["_id"] = str(x["_id"])

    return jsonify(tickets), 200


#Refunds a ticket for current user
@resource.route('/api/user_ticket/<ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    #TODO: verify user is logged in and get ID
    user_id = 1

    #TODO: verify showing time hasn't passed

    if (cmpe202_db_client.ticket.delete_one({"user_id": str(user_id), "_id": ObjectId(ticket_id)}).deleted_count):
        #TODO: give refund to user
        return "", 204
    else:
        return jsonify({"message": "Requested ticket not found or doesn't belong to user"}), 400
