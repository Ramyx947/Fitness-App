import os
import logging
from ariadne import MutationType, QueryType, graphql_sync, load_schema_from_path, make_executable_schema
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from prometheus_flask_exporter import PrometheusMetrics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
metrics = PrometheusMetrics(app)
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

metrics.info('app_info', 'Application info', version='1.0.3')

# Initialize the query type
query = QueryType()
mutation = MutationType()


# Define GraphQL resolver before making the schema
@query.field("recipes")
def resolve_recipes(_, info):
    try:
        logger.info("Resolver called")
        # Fetch recipes from the database
        recipes_cursor = db.recipes.find()
        recipes_list = []
        for recipe in recipes_cursor:
            logger.info(f"Found recipe: {recipe}")
            recipes_list.append({
                "recipeName": recipe.get("recipeName"),
                "ingredients": recipe.get("ingredients"),
                "calories": recipe.get("calories"),
                "nutrients": recipe.get("nutrients")
            })
        logger.info("Number of recipes found:", len(recipes_list))
        payload = {
            "success": True,
            "results": recipes_list
        }
        logger.info("Resolver Payload:", payload)
    except Exception as error:
        logger.error(f"Error: {error}")
        payload = {
            "success": False,
            "results": []
        }
    return payload


@mutation.field("addRecipe")
def add_recipe(_, info, recipe):
    try:
        logger.info("Add recipe mutation called")
        # Insert the recipe into the database
        db.recipes.insert_one(recipe)

        # Fetch the recipe from the database
        dbRecipe = db.recipes.find_one({"recipeName": recipe["recipeName"]})
        if dbRecipe is None:
            raise Exception("Failed to add the recipe")

        payload = {
            "success": True,
            "message": "Recipe added successfully",
            "recipe": dbRecipe
        }
        logger.info("Resolver Payload:", payload)
    except Exception as error:
        logger.error(f"Error: {error}")
        payload = {
            "success": False,
            "message": "Failed to add the recipe"
        }
    return payload


@mutation.field("removeRecipe")
def remove_recipe(_, info, recipe):
    try:
        logger.info("Add recipe mutation called")
        # Insert the recipe into the database
        db.recipes.delete_one(recipe)

        # Fetch the recipe from the database
        dbRecipe = db.recipes.find_one({"recipeName": recipe["recipeName"]})
        if dbRecipe is not None:
            raise Exception("Failed to remove the recipe")

        payload = {
            "success": True,
            "message": "Recipe removed successfully",
            "recipe": recipe
        }
        logger.info("Resolver Payload:", payload)
    except Exception as error:
        logger.error(f"Error: {error}")
        payload = {
            "success": False,
            "message": "Failed to remove the recipe"
        }
    return payload


# Set the path to the schema file and load it
schema_directory = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(schema_directory, "schema.graphql")
type_defs = load_schema_from_path(schema_path)
logger.info("Type Definitions Loaded:", type_defs)

schema = make_executable_schema(type_defs, query, mutation)


# Set up the GraphQL server
@app.route('/api/graphql', methods=['POST'])
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
GRAPHQL_PLAYGROUND_HTML_FP = os.path.join(schema_directory, "templates", "graphql_playground.html")
with open(GRAPHQL_PLAYGROUND_HTML_FP, 'r', encoding='utf-8') as file:
    html_content = file.read()


# graphql playground for health check
@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    logger.info("Received a GET request")
    return html_content, 200


# rest endpoint serving as a health check and welcome page
@app.route("/")
def index():
    return "<p>Hi and welcome to the recipes page!</p>"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5051)
