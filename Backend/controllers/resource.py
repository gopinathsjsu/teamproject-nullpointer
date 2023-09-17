from flask import Blueprint, jsonify


resource = Blueprint('resource', __name__)


@resource.route('/api/get_movie_showtimes', methods=['GET'])
def fetch_movie_showtimes():
    dummy = {
        "message": "I'm able to fetch showtimes :)"
    }

    return jsonify(dummy)
