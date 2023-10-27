"""Singleton Database Connection Initializer"""
from pymongo import MongoClient

import config.app_config as app_config


class DBServiceInitializer:
    __instance = None
    __app = None
    __db_client = None

    @staticmethod
    def get_db_instance(name):
        """ Static access method. """
        if DBServiceInitializer.__instance is None:
            DBServiceInitializer(name)
        return DBServiceInitializer.__instance

    def __init__(self, name):
        """ Virtually private constructor. """
        if DBServiceInitializer.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DBServiceInitializer.__instance = self
            DBServiceInitializer.__app = name
            DBServiceInitializer.__db_client = MongoClient(app_config.mongo_uri)
    
    def get_collection_instance(self, db_name):
        return DBServiceInitializer.__db_client[db_name]


''' OLD IMPLEMENTATION
class DBServiceClient:


    def __init__(self, mongodb_username, mongodb_password, db_name):
        mongo_uri = "mongodb+srv://{0}:{1}@cmpe202.2pmv4sg.mongodb.net/".format(
            mongodb_username, mongodb_password)
        db_client = MongoClient(mongo_uri)
        self.cmpe202_db = db_client[db_name]
'''