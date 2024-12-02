from dotenv import load_dotenv
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import json_util
import traceback
import logging
import os
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
mongo_db = os.getenv('MONGO_DB')

client = MongoClient(mongo_uri)
db = client[mongo_db]


@app.route('/')
def index():
    try:
        exercises = db.exercises.find()
        exercises_list = list(exercises)
        logger.info("Fetched exercises list")
        return json_util.dumps(exercises_list)
    except Exception as e:
        logger.error(f"Error fetching exercises: {e}")
        return jsonify(error="An internal error occurred"), 500


@app.route('/stats')
def stats():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]

    try:
        stats = list(db.exercises.aggregate(pipeline))
        logger.info("Fetched stats")
        return jsonify(stats=stats)
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return jsonify(error="An internal error occurred"), 500


@app.route('/stats/<username>', methods=['GET'])
def user_stats(username):
    pipeline = [
        {
            "$match": {"username": username}
        },
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]
    try:
        stats = list(db.exercises.aggregate(pipeline))
        return jsonify(stats=stats)
    except Exception as e:
        logger.error(f"Error fetching stats for user {username}: {e}")
        return jsonify(error="An internal error occurred"), 500


@app.route('/stats/weekly/', methods=['GET'])
def weekly_user_stats():
    username = request.args.get('user')
    start_date_str = request.args.get('start')
    end_date_str = request.args.get('end')

    date_format = "%Y-%m-%d"
    try:
        start_date = datetime.strptime(start_date_str, date_format)
        end_date = datetime.strptime(end_date_str, date_format) + timedelta(days=1)  # Include the whole end day

        logger.info(f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")
    except Exception as e:
        logger.error(f"Error parsing dates: {e}")
        return jsonify(error="Invalid date format"), 400

    pipeline = [
        {
            "$match": {
                "username": username,
                "date": {
                    "$gte": start_date,
                    "$lt": end_date
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"}
            }
        },
        {
            "$project": {
                "exerciseType": "$_id.exerciseType",
                "totalDuration": 1,
                "_id": 0
            }
        }
    ]

    try:
        stats = list(db.exercises.aggregate(pipeline))
        logger.info(f"Fetched weekly stats for user: {username}")
        return jsonify(stats=stats)
    except Exception as e:
        logger.error(f"An error occurred while querying MongoDB: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)