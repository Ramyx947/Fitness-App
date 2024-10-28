const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5300;
const mongoUri = process.env.MONGO_URI || 'mongodb://root:cfgmla23@mongodb:27017';  // Fallback to default
const mongoDb = process.env.MONGO_DB || 'activity';  // Fallback to default

// Middleware setup
app.use(cors());
app.use(express.json());

// Only connect to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, dbName: mongoDb })
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch((error) => console.error("MongoDB connection error:", error));
  
  const connection = mongoose.connection;
  connection.on('error', (error) => {
    console.error("MongoDB connection error:", error);
  });
}

// Routes
const exercisesRouter = require('./routes/exercises');
app.use('/exercises', exercisesRouter);

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;