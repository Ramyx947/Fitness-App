import json
import os

import mongomock
import pytest
from ariadne import load_schema_from_path

from app import app


@pytest.fixture
def client():
    # Use mongomock as the database client for tests
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_mongo(monkeypatch):
    # Replace the MongoDB client in the app with mongomock
    mock_client = mongomock.MongoClient()
    monkeypatch.setattr("app.db", mock_client['recipes'])
    return mock_client


def test_graphql_recipes_query(client, mock_mongo):
    """Test the GraphQL recipes query."""

    # Define the GraphQL query
    query = """
    query {
        recipes {
            success
            errors
            results {
                recipeName
                ingredients {
                    itemName
                    amount
                }
                calories
                nutrients {
                    nutrient
                    amount
                }
            }
        }
    }
    """

    # Insert mock data into the mocked MongoDB
    recipes_collection = mock_mongo['recipes'].recipes
    recipes_collection.insert_one({
        "recipeName": "Pasta",
        "ingredients": [{"itemName": "Noodles", "amount": 200}],
        "calories": 500,
        "nutrients": [{"nutrient": "Carbs", "amount": 50}]
    })

    # Execute the GraphQL query
    response = client.post('/recipes/graphql', json={'query': query})
    assert response.status_code == 200

    # Check the response data
    data = json.loads(response.data)
    print("Response JSON:", data)  # for debugging

    # Assertions based on expected response structure
    assert data['data']['recipes']['success'] is True
    assert len(data['data']['recipes']['results']) == 1
    recipe = data['data']['recipes']['results'][0]
    assert recipe['recipeName'] == "Pasta"
    assert recipe['calories'] == 500
    assert recipe['ingredients'][0]['itemName'] == "Noodles"


def test_graphql_add_recipe_mutation(client, mock_mongo):
    """Test the GraphQL addRecipe mutation."""

    # Define the GraphQL mutation
    mutation = """
    mutation {
      addRecipe(recipe: {
        recipeName: "Pizza",
        ingredients: [
          { itemName: "dough", amount: 100 },
          { itemName: "tomato", amount: 25 },
          { itemName: "cheese", amount: 500 }
        ],
        calories: 1500
      }) {
        success
        recipe {
          recipeName
          ingredients {
            itemName
          }
          calories
        }
      }
    }
    """

    # Execute the GraphQL mutation
    response = client.post('/recipes/graphql', json={'query': mutation})
    assert response.status_code == 200

    # Check the response data
    data = json.loads(response.data)
    print("Response JSON:", data)  # for debugging

    # Assertions based on expected response structure
    assert data['data']['addRecipe']['success'] is True
    recipe = data['data']['addRecipe']['recipe']
    assert recipe['recipeName'] == "Pizza"
    assert recipe['calories'] == 1500
    assert recipe['ingredients'][0]['itemName'] == "dough"


def test_mongo_connection(mock_mongo):
    db = mock_mongo['test_db']
    recipes_collection = db['recipes']
    recipes_collection.insert_one({
        "recipeName": "Test Recipe",
        "ingredients": [{"itemName": "Sauce", "amount": 100}],
        "calories": 400,
        "nutrients": [{"nutrient": "Fat", "amount": 30}]
    })
    inserted_recipe = recipes_collection.find_one({"recipeName": "Test Recipe"})
    assert inserted_recipe is not None, "Mock data was not inserted correctly."
    assert inserted_recipe['calories'] == 400


def test_schema_loading():
    # Define the correct path to the schema
    current_dir = os.path.dirname(os.path.abspath(__file__))
    schema_directory = os.path.join(current_dir, "..")

    # Load the schema from the correct directory
    type_defs = load_schema_from_path(schema_directory)

    # Debugging: Print the type definitions to verify they're loaded
    print("Loaded Type Definitions:", type_defs)

    # Check schema loaded as expected
    assert type_defs is not None, "Type definitions are not loaded."
    assert "schema {" in type_defs, "Schema definition is missing."
