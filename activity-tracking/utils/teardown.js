const mongoose = require('mongoose');

module.exports = async () => {
  if (mongoose.connection.readyState !== 0) {
    // Drop the database to ensure a clean state
    await mongoose.connection.dropDatabase();

    // Close the Mongoose connection
    await mongoose.connection.close();
  }

  // Stop the in-memory MongoDB server
  if (global.__MONGOSERVER__) {
    await global.__MONGOSERVER__.stop();
  }
};