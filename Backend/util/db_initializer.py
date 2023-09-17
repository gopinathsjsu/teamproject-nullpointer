# -*- coding: utf-8 -*-
from pymongo import MongoClient

class DBServiceClient:


    def __init__(self, mongodb_username, mongodb_password, db_name):
        mongo_uri = "mongodb+srv://{0}:{1}@cmpe202.2pmv4sg.mongodb.net/".format(
            mongodb_username, mongodb_password)
        db_client = MongoClient(mongo_uri)
        self.cmpe202_db = db_client[db_name]
    