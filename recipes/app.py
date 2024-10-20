import os
from dotenv import load_dotenv
from flask import Flask
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

@app.route('/')
def index():
    recipes = db.recipes.find()
    recipes_list = list(recipes)
    return json_util.dumps(recipes_list)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5051)