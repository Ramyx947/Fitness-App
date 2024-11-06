import os
from ariadne import (
    QueryType, graphql_sync, load_schema_from_path, make_executable_schema
)
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

load_dotenv()
mongo_uri = os.getenv('MOGO_URI')
mongo_db = os.getenv('MONGO_DB')

client = MongoClient(mongo_uri)
db = client[mongo_db]

# initialise the query type, load the schema and make it executable
query = QueryType()
type_defs = load_schema_from_path("schema.graphql")
schema = make_executable_schema(type_defs, query)


# set up the graphql server
@app.route('/api/graphql', methods=['POST'])
def graphql_server():
    print("Received a POST request")
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


# grapqhql resolver field recipes
def recipes(_, info):
    try:
        print("Resolving the recipes info")
        payload = {
            "success": True,
            "results": []  # empty until db has been implemented
        }
    except Exception as error:
        print(f"Error in resolving recipes: {error}")
        payload = {
            "success": False,
            "results": []
        }
    return payload


# rest endpoint serving as a health check and welcome page
@app.route("/")
def index():
    return "<p>Hi and welcome to the recipes page!</p>"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5051)
