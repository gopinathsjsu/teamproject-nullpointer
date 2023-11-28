from bson import ObjectId

import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger


cmpe202_db_client = DBServiceInitializer.get_db_instance(
    __name__).get_collection_instance(app_config.db_name)
logger = AppLogger.getInstance(__name__).getLogger()


# Calculates the price of a showtime based on active discounts
def get_active_price(showtime_id):

    price_cursor = cmpe202_db_client.showtimes.aggregate(
        [
            {"$match": {
                "_id": ObjectId(showtime_id),
                "$and": [
                    {"$or": [
                        {"deleted": {"$exists": False}},
                        {"deleted": False}
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
              "discount": {
                "$cond": {
                  "if": {"$eq": [{"$ifNull": ["$discount_data", None]}, None]},
                  "then": int(0),
                  "else": "$discount_data.percentage"
                }
              }
            }},
            {"$project": {
                "price": {
                "$subtract": [
                    "$price",
                    {"$divide": [
                        {"$multiply": ["$price", "$discount"]},
                        int(100)
                    ]}
                ]
              }
            }}
        ]
    )

    price = 20.0
    for rec in price_cursor:
        price = rec["price"] if "price" in rec else price

    return price

    '''
    rec = cmpe202_db_client.showtimes.find_one({
            "_id": showtime_id,
            "$or": [
                {"deleted": {"$exists": False}},
                {"deleted": False}
            ]
        })

    if "show_date" not in rec:
        return 0.0
    
    show_date = rec["show_date"]

    # Probably a better way to get just the sum value out of this
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
    '''