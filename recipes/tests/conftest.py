from unittest.mock import patch

import mongomock
import pytest


@pytest.fixture(scope='session')
def mock_mongo():
    # Patch 'pymongo.MongoClient' before 'app' is imported
    with patch('pymongo.MongoClient', new=mongomock.MongoClient):
        yield mongomock.MongoClient()


@pytest.fixture
def client(mock_mongo):
    from app import app as flask_app  # Import after patching
    with flask_app.test_client() as client:
        yield client
