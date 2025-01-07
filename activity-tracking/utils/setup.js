const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  // Enable debug logs for mongodb-memory-server
  process.env.DEBUG = 'mongodb-memory-server*';

  // Create an in-memory MongoDB instance with increased timeout
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'activity-test',
    },
    binary: {
      // Set download timeout to 2 minutes
      download: {
        timeout: 120000, // 120 seconds
      },
    },
    timeout: 120000, // 120 seconds for instance startup
  });

  const uri = mongoServer.getUri();

  // Set the MONGO_URI environment variable for the server to use
  process.env.MONGO_URI = uri;

  global.__MONGO_URI__ = uri;

  // Connect Mongoose to the in-memory MongoDB
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Make the MongoMemoryServer instance available globally for teardown
  global.__MONGOSERVER__ = mongoServer;
};
