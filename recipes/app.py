import os
from ariadne import QueryType, graphql_sync, load_schema_from_path, make_executable_schema
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

load_dotenv()
mongo_uri = os.getenv('MOGO_URI')
mongo_db = os.getenv('MONGO_DB')

client = MongoClient(mongo_uri)
db = client[mongo_db]
# access the collection - will create it, if it does not exist
collection = db['recipes']

# sample data to insert into collection
sample_data = [
    {"recipeName": "Potato Salad", 
     "ingredients": [
        {"itemName": "potato", "amount": "3"}, {"itemName": "cucumber", "amount": "1"}],
     "calories": 200,
     "nutrients": [{"nutrient": "protein", "amount": "2"}, {"nutrient": "fat", "amount": "8"}]
    }
]

# insert data into collection
result = collection.insert_many(sample_data)
print("Data inserted with record ids", result.inserted_ids)

# initialise the query type, load the schema
query = QueryType()
type_defs = load_schema_from_path("schema.graphql")

# set up the graphql server
@app.route('/api/graphql', methods=['POST'])
def graphql_server():
    print("Received a POST request")
    data = request.get_json()
    success, result = graphql_sync(
        schema, 
        data,
        context_value = request,
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
@query.field("recipes")
def recipes(_, info):
     try:
        print("Resolving the recipes info")
        loadedRecipes = get_recipes()
        print(loadedRecipes)
        payload = {
            "success": True, 
            "results": loadedRecipes
        }
     except Exception as error:
        payload = {
            "succes": False, 
            "results": [str(error)]
        }
     return payload

def get_recipes():
    # define an empty pipeline to retrieve all entries
    pipeline = []
    all_recipes = list(collection.aggregate(pipeline))
    return all_recipes

# make schema executable
schema = make_executable_schema(type_defs, query)

# rest endpoint serving as a health check and welcome page
@app.route("/")
def index():
    return "<p>Hi and welcome to the recipes page!</p>"
    # recipes = db.recipes.find()
    # recipes_list = list(recipes)
    # return json_util.dumps(recipes_list)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5051)