import traceback
from dotenv import load_dotenv
from flask import Flask, current_app, json, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import json_util
import os
import logging
from datetime import datetime, timedelta
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync, QueryType

# set up flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

load_dotenv()
title = "Weekly Exercise Tracker Statistics"
heading = "MLA Flask Microservice"
user = "testuser"
mongo_uri = os.getenv('MONGO_URI')

client = MongoClient(mongo_uri)
db = client.test

# initialise the query type, load the schema and make it executable
query = QueryType()
type_defs = load_schema_from_path("schema.graphql")

# set up the graphql server
@app.route('/api/graphql', methods=['POST'])
def graphql_server():
    print("Received a POST request ...")
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data, 
        context_value=request, 
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

# Define the HTML for GraphQL Playground
GRAPHQL_PLAYGROUND_HTML_FP = "templates/graphql_playground.html"
with open(GRAPHQL_PLAYGROUND_HTML_FP, 'r', encoding='utf-8') as file:
    html_content = file.read()

# graphql playground for health check
@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    print("Received a GET request")
    return html_content, 200

# rest endpoint serving as a health check and welcome page
@app.route('/')
def index():
    exercises = db.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

# grapqhql resolver field stats
@query.field("stats")
def resolve_stats(_, info):
    try:
        print("Resolving the list stats info")
        loadedStats = stats()
        print(loadedStats)
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

# grapqhql resolver field filteredStats
@query.field("filteredStats")
def resolve_filteredStats(*_, name=None):
    try:
        print("Resolving the list stats info")
        loadedStats = user_stats(name)
        print(loadedStats)
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

# grapqhql resolver field weekly
@query.field("weekly")
def resolve_weekly(_, info, user, start, end):
    try:
        print("Resolving the list weekly stats info")
        weeklyStats = weekly_user_stats(user, start, end)
        print(weeklyStats)
        payload = {
            "success": True,
            "results": weeklyStats
        }
    except Exception as error:
        current_app.logger.error(f"Error in resolving weekly stats: {error}")
        payload = {
            "success": False,
            "errors": [str(error) if str(error) else "Could not retrieve weekly statistics for the specified time period for the current user."],
        }
    return payload

# Function to fetch overall stats
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

    stats = list(db.exercises.aggregate(pipeline))
    return stats

# Function to fetch user-specific stats
def user_stats(username):
    print(f"Fetching stats for user: {username}")
    
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

    stats = list(db.exercises.aggregate(pipeline))
    return stats
    

# rest endpoint for weekly to compare newly implemented graphql endpoint to
@app.route('/stats/weekly/', methods=['GET'])
def weekly_user_stats(user, start, end):
    print(f"Fetching weekly stats for user: {user}, time period: {start} - {end} ")

    # Parse the dates
    date_format = "%Y-%m-%d"
    start_date = datetime.strptime(start, date_format)
    end_date = datetime.strptime(end, date_format)

    pipeline = [
        {
            "$match": {
                "username": user,
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
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

    stats = list(db.exercises.aggregate(pipeline))
    return stats

schema = make_executable_schema(type_defs, query)

@app.errorhandler(Exception)
def handle_error(e):
    app.logger.error(f"An error occurred: {e}")
    traceback.print_exc()
    return jsonify(error="An internal error occurred"), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)

