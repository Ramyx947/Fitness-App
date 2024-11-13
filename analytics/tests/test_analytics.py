import os
import json
from ariadne import load_schema_from_path
import sys
from datetime import datetime

# Add the parent directory to sys.path, to get the correct app path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


def test_graphql_stats_query(client, mock_mongo):
    # Insert mock data into the shared mock MongoDB
    stats_collection = mock_mongo['test'].exercises
    stats_collection.insert_many([
        {"username": "testuser", "exerciseType": "Running", "duration": 120},
        {"username": "testuser", "exerciseType": "Swimming", "duration": 90}
    ])

    # Define the GraphQL query
    query = """
    query {
        stats {
            success
            errors
            results {
                username
                exercises {
                    exerciseType
                    totalDuration
                }
            }
        }
    }
    """
    response = client.post('/api/graphql', json={'query': query})
    assert response.status_code == 200

    # Parse the response data
    data = json.loads(response.data)

    # Assertions
    assert data['data']['stats']['success'] is True
    assert len(data['data']['stats']['results']) == 1
    stats = data['data']['stats']['results'][0]
    assert stats['username'] == "testuser"
    assert len(stats['exercises']) == 2
    assert stats['exercises'][0]['exerciseType'] == "Running"
    assert stats['exercises'][0]['totalDuration'] == 120
    assert stats['exercises'][1]['exerciseType'] == "Swimming"
    assert stats['exercises'][1]['totalDuration'] == 90


def test_graphql_filtered_stats_query(client, mock_mongo):
    """
    Tests the GraphQL 'filteredStats' query for filtering statistics by username.

    Args:
        client: Pytest fixture for the test client.
        mock_mongo: Pytest fixture for the mocked MongoDB client.
    """
    # Define the GraphQL query with a variable
    query = """
    query FilteredStats($name: String) {
        filteredStats(name: $name) {
            success
            errors
            results {
                username
                exercises {
                    exerciseType
                    totalDuration
                }
            }
        }
    }
    """
    variables = {"name": "johndoe"}

    # Insert mock data into the mocked MongoDB
    stats_collection = mock_mongo['test'].exercises
    stats_collection.insert_many([
        {
            "username": "johndoe",
            "exerciseType": "Cycling",
            "duration": 150
        },
        {
            "username": "johndoe",
            "exerciseType": "Yoga",
            "duration": 60
        },
        {
            "username": "janedoe",
            "exerciseType": "Running",
            "duration": 100
        }
    ])

    # Execute the GraphQL query
    response = client.post('/api/graphql', json={'query': query, 'variables': variables})
    assert response.status_code == 200

    # Parse the response data
    data = json.loads(response.data)

    # Assertions
    assert data['data']['filteredStats']['success'] is True
    assert len(data['data']['filteredStats']['results']) == 1
    stats = data['data']['filteredStats']['results'][0]
    assert stats['username'] == "johndoe"
    assert len(stats['exercises']) == 2
    assert stats['exercises'][0]['exerciseType'] == "Cycling"
    assert stats['exercises'][0]['totalDuration'] == 150
    assert stats['exercises'][1]['exerciseType'] == "Yoga"
    assert stats['exercises'][1]['totalDuration'] == 60


def test_graphql_weekly_query(client, mock_mongo):
    """
    Tests the GraphQL 'weekly' query for fetching weekly statistics.

    Args:
        client: Pytest fixture for the test client.
        mock_mongo: Pytest fixture for the mocked MongoDB client.
    """
    # Define the GraphQL query with variables
    query = """
    query WeeklyStats($user: String!, $start: String!, $end: String!) {
        weekly(user: $user, start: $start, end: $end) {
            success
            errors
            results {
                username
                exercises {
                    exerciseType
                    totalDuration
                }
            }
        }
    }
    """
    variables = {
        "user": "janedoe",
        "start": "2023-09-01",
        "end": "2023-09-07"
    }

    # Insert mock data into the mocked MongoDB
    stats_collection = mock_mongo['test'].exercises
    stats_collection.insert_many([
        {
            "username": "janedoe",
            "exerciseType": "Swimming",
            "duration": 80,
            "date": datetime(2023, 9, 3)
        },
        {
            "username": "janedoe",
            "exerciseType": "Pilates",
            "duration": 70,
            "date": datetime(2023, 9, 3)
        }
    ])

    # Execute the GraphQL query
    response = client.post('/api/graphql', json={'query': query, 'variables': variables})
    assert response.status_code == 200

    # Parse the response data
    data = json.loads(response.data)

    # Assertions
    assert data['data']['weekly']['success'] is True
    assert len(data['data']['weekly']['results']) == 1
    stats = data['data']['weekly']['results'][0]
    assert stats['username'] == "janedoe"
    # Extract the exercises list from the response
    exercises = stats['exercises']

    # Create a mapping from exerciseType to totalDuration
    exercise_map = {exercise['exerciseType']: exercise['totalDuration'] for exercise in exercises}

    # Assert that both exercises are present with correct durations
    assert exercise_map["Swimming"] == 80
    assert exercise_map["Pilates"] == 70


def test_mongo_connection(mock_mongo):
    """
    Tests the MongoDB connection by inserting and retrieving mock data.

    Args:
        mock_mongo: Pytest fixture for the mocked MongoDB client.
    """
    db = mock_mongo['test']
    stats_collection = db['exercises']
    stats_collection.insert_many([
        {
            "username": "testuser",
            "exerciseType": "Cycling",
            "duration": 200,
            "date": datetime(2023, 9, 4)
        },
        {
            "username": "testuser",
            "exerciseType": "Boxing",
            "duration": 150,
            "date": datetime(2023, 9, 5)
        }
    ])
    inserted_stat1 = stats_collection.find_one({"username": "testuser", "exerciseType": "Cycling"})
    inserted_stat2 = stats_collection.find_one({"username": "testuser", "exerciseType": "Boxing"})
    assert inserted_stat1 is not None, "Mock data for Cycling was not inserted correctly."
    assert inserted_stat1['username'] == "testuser"
    assert inserted_stat1['exerciseType'] == "Cycling"
    assert inserted_stat1['duration'] == 200

    assert inserted_stat2 is not None, "Mock data for Boxing was not inserted correctly."
    assert inserted_stat2['username'] == "testuser"
    assert inserted_stat2['exerciseType'] == "Boxing"
    assert inserted_stat2['duration'] == 150


def test_schema_loading():
    """
    Tests whether the GraphQL schema loads correctly.
    """

    # Define the correct path to the schema
    current_dir = os.path.dirname(os.path.abspath(__file__))
    schema_directory = os.path.join(current_dir, "..")

    # Load the schema from the correct directory
    type_defs = load_schema_from_path(os.path.join(schema_directory, "schema.graphql"))

    # Check schema loaded as expected
    assert type_defs is not None, "Type definitions are not loaded."
    assert "schema {" in type_defs, "Schema definition is missing."
