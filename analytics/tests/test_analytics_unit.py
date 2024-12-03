"""
Unit tests for the analytics app.
Unit tests mock external dependencies like the MongoDB client to isolate functionality.
"""

import pytest
from unittest.mock import MagicMock
from app import app, stats, user_stats


@pytest.fixture
def client():
    """
    Fixture to create a test client for the Flask application.

    Returns:
        Flask app test client.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_stats_unit(monkeypatch):
    # Mock the MongoDB connection
    mock_db = MagicMock()
    mock_db.exercises.aggregate.return_value = [
        {"exerciseType": "Swimming", "totalDuration": 80},
        {"exerciseType": "Pilates", "totalDuration": 70}
    ]

    # Patch the db object in the app
    monkeypatch.setattr("app.db", mock_db)

    # Call the stats function
    result = stats()
    assert result == [
        {"exerciseType": "Swimming", "totalDuration": 80},
        {"exerciseType": "Pilates", "totalDuration": 70}
    ]


def test_user_stats_unit(monkeypatch):
    # Mock the MongoDB connection
    mock_db = MagicMock()
    mock_db.exercises.aggregate.return_value = [
        {"exerciseType": "Running", "totalDuration": 20},
        {"exerciseType": "Gym", "totalDuration": 30}
    ]

    # Patch the db object in the app
    monkeypatch.setattr("app.db", mock_db)

    # Call the user_stats function
    result = user_stats("tina")
    assert result == [
        {"exerciseType": "Running", "totalDuration": 20},
        {"exerciseType": "Gym", "totalDuration": 30}
    ]