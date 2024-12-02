import pytest
from unittest.mock import patch
import mongomock


@pytest.fixture(scope='session')
def mock_mongo():
    # Create a single mongomock client instance
    mock_client = mongomock.MongoClient()
    return mock_client


@pytest.fixture
def client(mock_mongo):
    # Patch 'pymongo.MongoClient' to return the mock_mongo instance
    with patch('pymongo.MongoClient', return_value=mock_mongo):
        from app import app
        with app.test_client() as client:
            yield client
