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
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")\

# load env vars
load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
mongo_db = os.getenv('MONGO_DB')

# set up db client and db
client = MongoClient(mongo_uri)
db = client[mongo_db]

# initialise the query type, load the schema and make it executable
query = QueryType()
type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(type_defs, query)

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
    graphql_playground_html_content = file.read()

# graphql playground for health check
@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    print("Received a GET request")
    return graphql_playground_html_content, 200

# define the resolvers for the queries defined in the schema
@query.field("stats")
def resolve_stats(_, info):
    try:
        print("Resolving the list stats info")
        loadedStats_json = stats()
        loadedStats_text = json.loads(loadedStats_json)
        print(loadedStats_text)
        payload = {
            "success": True, 
            "results": loadedStats_text
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

@query.field("filteredStats")
def resolve_filteredStats(*_, name=None):
    try:
        print("Resolving the list filtered stats info")
        userStats_json = user_stats(name)
        userStats_text = json.loads(userStats_json)
        print(userStats_text)
        payload = {
            "success": True,
            "results": userStats_text
        }
    except Exception as error:
        payload = {
            "success": False,
            "results": [str(error)]
        }
    return payload

# rest endpoint serving as a health check
@app.route('/')
def index():
    exercises = db.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

# keeping rest endpoint in addition to graphql to test both with featureflag
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

    stats = list(db.exercises.aggregate(pipeline))
    return jsonify(stats=stats)

# keeping rest endpoint in addition to graphql to test both with featureflag
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

    stats = list(db.exercises.aggregate(pipeline))
    return jsonify(stats=stats)


# no graphql endpoint for this functionality yet
@app.route('stats/weekly/', methods=['GET'])
def weekly_user_stats():
    username = request.args.get('user')
    start_date_str = request.args.get('start')
    end_date_str = request.args.get('end')

    date_format = "%Y-%m-%d"
    try:
        start_date = datetime.strptime(start_date_str, date_format)
        end_date = datetime.strptime(end_date_str, date_format) + timedelta(days=1)  # Include the whole end day

        logging.info(f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")
    except Exception as e:
        logging.error(f"Error parsing dates: {e}")
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
        return jsonify(stats=stats)
    except Exception as e:
        current_app.logger.error(f"An error occurred while querying MongoDB: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)