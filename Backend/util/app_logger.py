import logging
import logging.handlers

import config.app_config as app_config


class AppLogger:
    __instance = None
    __logger = None

    @staticmethod
    def getInstance(name):
        """ Static access method. """
        if AppLogger.__instance == None:
            AppLogger(name)
        return AppLogger.__instance

    def __init__(self, name):
        """ Virtually private constructor. """
        if AppLogger.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            AppLogger.__instance = self
        # Create logger
        logger = logging.getLogger("c-cube")
        logger.setLevel(logging.INFO)
        # Handler
        handler = logging.handlers.RotatingFileHandler(
            app_config.LOG_PATH, maxBytes=1048576, backupCount=5)
        handler.setLevel(logging.INFO)
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s\t[%(levelname)s]\t%(message)s ')
        # Add Formatter to Handler
        handler.setFormatter(formatter)
        # add Handler to Logger
        logger.addHandler(handler)
        AppLogger.__logger = logger

    def getLogger(self):
        return AppLogger.__logger
