"""Singleton Flask Application Initializer"""

from flask import Flask


class AppInitializer:
    __instance = None
    __app = None

    @staticmethod
    def get_instance(name):
        """ Static access method. """
        if AppInitializer.__instance == None:
            AppInitializer(name)
        return AppInitializer.__instance

    def __init__(self, name):
        """ Virtually private constructor. """
        if AppInitializer.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            AppInitializer.__instance = self
            AppInitializer.__app = Flask(name)

    def get_flask_app(self):
        return AppInitializer.__app
