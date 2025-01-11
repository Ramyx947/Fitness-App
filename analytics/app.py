import traceback
import logging
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import json_util
import os
from datetime import datetime, timedelta
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync, QueryType
from prometheus_flask_exporter import PrometheusMetrics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up the Flask application and integrate Prometheus metrics for monitoring
app = Flask(__name__)
metrics = PrometheusMetrics(app)

# Load environment variables from .env file and initialize the MongoDB client connection
# Use 'mongo_uri' for the connection string and 'mongo_db' for the database name
load_dotenv()
title = "Weekly Exercise Tracker Statistics"
heading = "MLA Flask Microservice"
user = "testuser"
mongo_uri = os.getenv('MONGO_URI')
mongo_db = os.getenv('MONGO_DB')

client = MongoClient(mongo_uri)
db = client[mongo_db]

metrics.info('app_info', 'Application info', version='1.0.3')

# initialise the query type, load the schema and make it executable
query = QueryType()

# GraphQL resolver for the 'stats' field
# Aggregates overall statistics for all users from the MongoDB 'exercises' collection
@query.field("stats")
def resolve_stats(_, info):
    try:
        logger.info("Resolver called")
        # Fetch statistics from the database
        loadedStats = stats()
        logger.info("Number of stats found:", len(loadedStats))
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        logger.error(f"Error resolving stats: {error}")
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload


# grapqhql resolver field filteredStats
@query.field("filteredStats")
def resolve_filteredStats(*_, name=None):
    try:
        loadedStats = user_stats(name)
        logger.info("Number of user stats found:", len(loadedStats))
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        logger.error(f"Error resolving filteredStats: {error}")
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

# GraphQL resolver for the 'weekly' field
# Fetches aggregated exercise statistics for a specific user within a given time range
# Calls the helper function 'get_weekly_stats' to query the MongoDB database
@query.field("weekly")
def resolve_weekly(_, info, user, start, end):
    try:
        weeklyStats = get_weekly_stats(user, start, end)
        if not weeklyStats:
            logger.warning(f"No data found for user {user} from {start} to {end}.")
            return {
                "success": True,
                "results": [],
                "errors": []
            }

        return {
            "success": True,
            "results": weeklyStats,
            "errors": []
        }
    except Exception as error:
        logger.error(f"Error resolving weekly stats: {error}")
        return {
            "success": False,
            "results": [],
            "errors": [str(error) if str(error) else "Unknown error occurred."]
        }

# Fetches overall exercise stats grouped by user and exercise type
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

# rest endpoint for weekly to compare to newly implemented graphql endpoint
def weekly_user_stats_route():
    user = request.args.get("user")
    start = request.args.get("start")
    end = request.args.get("end")

    if not user or not start or not end:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        stats = get_weekly_stats(user, start, end)
        return jsonify({"results": stats, "success": True}), 200
    except Exception as e:
        logger.error(f"Error fetching weekly stats: {e}")
        return jsonify({"error": str(e), "success": False}), 500

# Helper function to fetch weekly exercise statistics for a specific user within a date range
# Queries the MongoDB 'exercises' collection using an aggregation pipeline
# Returns a list of exercises grouped by type and total duration
def get_weekly_stats(user, start, end):
    logger.info(f"Fetching weekly stats for user: {user}, time period: {start} - {end}")

    # Parse the dates
    date_format = "%Y-%m-%d"
    try:
        start_date = datetime.strptime(start, date_format)
        end_date = datetime.strptime(end, date_format)
    except ValueError as e:
        logger.error(f"Date parsing failed: {e}")
        return []

    pipeline = [
        {
            "$match": {
                "username": user,
                "date": {
                    "$gte": start_date,
                    "$lte": end_date + timedelta(days=1)  # Include the entire end date
                }
            }
        },
        {
            "$group": {
                "_id": "$username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$exerciseType",
                        "totalDuration": "$duration"
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
        logger.info(f"Pipeline results: {stats}")
        return stats
    except Exception as e:
        logger.error(f"Error during aggregation: {e}")
        return []

# Global error handler for unhandled exceptions
# Logs the error with traceback details and returns a generic 500 error response
@app.errorhandler(Exception)
def handle_error(e):
    logger.error(f"An error occurred: {e}")
    traceback.print_exc()
    return jsonify(error="An internal error occurred"), 500

# Set the path to the schema file and load it
schema_directory = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(schema_directory, "schema.graphql")
type_defs = load_schema_from_path(schema_path)
logger.info("Type Definitions Loaded: %s", type_defs)

schema = make_executable_schema(type_defs, query)

@app.route('/analytics/graphql', methods=['POST', 'OPTIONS'])
def graphql_server():
    logger.info("Received a POST request")
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
@app.route('/analytics/graphql', methods=['GET'])
def graphql_playground():
    return html_content, 200

# rest endpoint serving as a health check and welcome page
@app.route('/', methods=['GET'])
def index():
    exercises = db.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)
