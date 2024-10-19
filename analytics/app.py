from dotenv import load_dotenv
from flask import Flask, jsonify, request
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

# Define the HTML for GraphQL Playground
# TODO: move this into templates/ and load from there
PLAYGROUND_HTML = '''
<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GraphQL Playground</title>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
    <link rel="shortcut icon" href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
    <script src="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
</head>

<body>
    <style>
        body {
            height: 100%;
            width: 100%;
            margin: 0;
            overflow: hidden;
        }

        #root {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .loading {
            font-family: 'Open Sans', sans-serif;
            font-size: 32px;
        }
    </style>
    <div id="root">
        <div class="loading">Loading
            <img src='//cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png' alt="Loading..." />
        </div>
    </div>
    <script>
        window.addEventListener('load', function (event) {
            const root = document.getElementById('root');
            const playground = GraphQLPlayground.init(root, {
                endpoint: '/api/graphql',
            });
        });
    </script>
</body>

</html>
'''


@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    print("Received a GET request")
    return PLAYGROUND_HTML, 200

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

# define the resolvers for the queries defined in the schema
@query.field("stats")
def resolve_stats(_, info):
    try:
        print("Resolving the list stats info")
        loadedStats = stats()
        print(loadedStats)
        # payload matches expected output for the stats query in schema
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

@query.field("filteredStats")
def resolve_filteredStats(*_, name=None):
    """
    Function to resolve the filteredStats graphql query

    Arguments:
    - "*_" : Any number of positional arguments, but not required. 

             The "*" collects all positional arguments into a tuple
             where _ is the name given to the tuple. In this case, it is used to indicate that
             the variable's value is intentionally ignored or unused.

    - name: Keyword argument with a default value set to None. 

            The caller can provide a value for name, but if they don't, 
            the default value None will be used.
    """
    try:
        print("Resolving the list filtered stats info")
        userStats = user_stats(name)
        print(userStats)
        # payload matches expected output for the filteredStats query in schema
        payload = {
            "success": True,
            "results": userStats
        }
    # TODO: could use a more specific Exception here
    except Exception as error:
        payload = {
            "success": False,
            "results": [str(error)]
        }
    return payload

@app.route('/')
def index():
    exercises = db.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

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
    return stats

schema = make_executable_schema(type_defs, query)

@app.route('/weekly/', methods=['GET'])
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

    stats = list(db.exercises.aggregate(pipeline))
    return jsonify(stats=stats)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)