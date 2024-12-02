"""
Unit tests for the analytics app.
Unit tests mock external dependencies like the MongoDB client to isolate functionality.
"""

import pytest
from unittest.mock import MagicMock
from flask import Flask
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
    # Mock the MongoDB client
    mock_db = MagicMock()
    mock_db.exercises.aggregate.return_value = [
        {"exerciseType": "Swimming", "totalDuration": 80},
        {"exerciseType": "Pilates", "totalDuration": 70}
    ]
    monkeypatch.setattr("app.db.exercises.aggregate", mock_db.exercises.aggregate)

    # Call the stats function
    result = stats()
    assert len(result) == 2
    assert result == [
        {"exerciseType": "Swimming", "totalDuration": 80},
        {"exerciseType": "Pilates", "totalDuration": 70}
    ]

def test_user_stats_unit():
    pass