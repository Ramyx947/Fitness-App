import os
from ariadne import QueryType, graphql_sync, load_schema_from_path, make_executable_schema
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]
)

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
mongo_db = os.getenv('MONGO_DB')

client = MongoClient(mongo_uri)
db = client[mongo_db]

# Initialize the query type
query = QueryType()


# Define GraphQL resolver before making the schema
@query.field("recipes")
def resolve_recipes(_, info):
    try:
        print("Resolver called")
        # Fetch recipes from the database
        recipes_cursor = db.recipes.find()
        recipes_list = []
        for recipe in recipes_cursor:
            print(f"Found recipe: {recipe}")
            recipes_list.append({
                "recipeName": recipe.get("recipeName"),
                "ingredients": recipe.get("ingredients"),
                "calories": recipe.get("calories"),
                "nutrients": recipe.get("nutrients")
            })
        print("Number of recipes found:", len(recipes_list))
        payload = {
            "success": True,
            "results": recipes_list
        }
        print("Resolver Payload:", payload)
    except Exception as error:
        print(f"Error: {error}")
        payload = {
            "success": False,
            "results": []
        }
    return payload


# Set the path to the schema file and load it
schema_directory = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(schema_directory, "schema.graphql")
type_defs = load_schema_from_path(schema_path)
print("Type Definitions Loaded:", type_defs)

schema = make_executable_schema(type_defs, query)


# Set up the GraphQL server
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
GRAPHQL_PLAYGROUND_HTML_FP = os.path.join(schema_directory, "templates", "graphql_playground.html")
with open(GRAPHQL_PLAYGROUND_HTML_FP, 'r', encoding='utf-8') as file:
    html_content = file.read()


# graphql playground for health check
@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    print("Received a GET request")
    return html_content, 200


# rest endpoint serving as a health check and welcome page
@app.route("/")
def index():
    return "<p>Hi and welcome to the recipes page!</p>"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5051)
