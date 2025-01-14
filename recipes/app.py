import os
import logging
from ariadne import MutationType, QueryType, graphql_sync, load_schema_from_path, make_executable_schema
from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template
import requests
# from flask_cors import CORS
from pymongo import MongoClient
from prometheus_flask_exporter import PrometheusMetrics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
metrics = PrometheusMetrics(app)

# Set up CORS
env = os.getenv('NODE_ENV', 'development')

allowed_origins = {
    "development": [
        "http://localhost:3000",  # Frontend
        "http://localhost:5300",  # Activity-tracking
        "http://localhost:5051",  # Recipes
        "http://localhost:8080",  # Auth service
        "http://localhost:50"  # CI pipeline port
    ],
    "production": [
        "https://fitapp.co.uk"  # Main production domain
    ]
}

# CORS(app, resources={r"/*": {"origins": allowed_origins.get(env, [])}}, supports_credentials=True)

# @app.before_request
# def handle_preflight():
#     if request.method == 'OPTIONS':
#             response = jsonify({'message': 'Preflight okay'})
#             response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin')
#             response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
#             response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
#             return response, 204

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')
mongo_db = os.getenv('MONGO_DB')
# get spoonacular api env var values
spoonacular_api_url = os.getenv('SPOONACULAR_API_URL')
spoonacular_api_key = os.getenv('SPOONACULAR_API_KEY')

client = MongoClient(mongo_uri)
db = client[mongo_db]

metrics.info('app_info', 'Application info', version='1.0.3')

# Initialize the query type
query = QueryType()
mutation = MutationType()


# Define GraphQL resolver before making the schema
# query to retrieve recipes created by the user
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


# mutation so a user can add their own recipe
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


# mutation so a user can remove a recipe that they have previously added
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
logger.info("Type Definitions Loaded: %s", type_defs)
schema = make_executable_schema(type_defs, query, mutation)


# Set up the GraphQL server
@app.route('/recipes/graphql', methods=['POST', 'OPTIONS'])
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


# Define the HTML for the GraphQL Playground
GRAPHQL_PLAYGROUND_HTML_FP = os.path.join(schema_directory, "templates", "graphql_playground.html")
with open(GRAPHQL_PLAYGROUND_HTML_FP, 'r', encoding='utf-8') as file:
    html_content = file.read()


# graphql playground for health check
@app.route('/recipes/graphql', methods=['GET'])
def graphql_playground():
    logger.info("Received a GET request")
    return html_content, 200


# rest endpoint serving as a health check and welcome page
@app.route("/")
def index():
    return render_template('index.html')


# handle the form submission (POST request) where a user can specify the recipe to search for
# the returned recipes are retrieved from the soonacular api recipe collection
@app.route('/submit', methods=['POST'])
def submit():
    recipe = request.form.get('recipe')
    count = request.form.get('count')

    if recipe and count:
        data = get_recipe_collection(recipe, count)

        # example: use for testing to avoid hitting the daily spoonacular api request quota with the free tier
        # data = {
        # "number": 2,
        # "offset": 0,
        # "results": [
        #     {
        #     "id": 642583,
        #     "image": "https://img.spoonacular.com/recipes/642583-312x231.jpg",
        #     "imageType": "jpg",
        #     "title": "Farfalle with Peas, Ham and Cream"
        #     },
        #     {
        #     "id": 715538,
        #     "image": "https://img.spoonacular.com/recipes/715538-312x231.jpg",
        #     "imageType": "jpg",
        #     "title": "What to make for dinner tonight?? Bruschetta Style Pork \u0026 Pasta"
        #     }
        # ],
        # "totalResults": 285
        # }

        return render_template('display_json.html', results=data["results"])

    else:
        return jsonify({"error": "Please provide both a recipe name and count"}), 400


@app.route('/api/recipecollection', methods=['GET'])
def get_recipe_collection(recipe, count):
    # fetch recipes from the Spoonacular API
    params = {
        'apiKey': spoonacular_api_key,
        'query': recipe,
        'number': count
    }
    response = requests.get(spoonacular_api_url, params=params)

    if response.status_code == 200:
        return response.json()

    else:
        return jsonify({"error": "Failed to fetch recipes from external API"}), 500


if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=5051)
