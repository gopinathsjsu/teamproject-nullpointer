import config.app_config as app_config
from util.db_initializer import DBServiceInitializer
from util.app_logger import AppLogger


cmpe202_db_client = DBServiceInitializer.get_db_instance(
    __name__).get_collection_instance(app_config.db_name)
logger = AppLogger.getInstance(__name__).getLogger()


# Calculates the price of a showtime based on active discounts
def get_active_price(showtime_id):
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
    