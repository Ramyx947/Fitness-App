const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const promClient = require('prom-client');
const helmet = require("helmet");
require('dotenv').config(); 
const config = require('./config.json');
const { LogCategory } = require("./logging");
const log = new LogCategory("activity-tracking-server.js");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5300;
const mongoUri = process.env.MONGO_URI || 'mongodb://root:cfgmla23@mongodb:27017';  // Fallback to default
const mongoDb = process.env.MONGO_DB || 'activity';  // Fallback to default

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());

// Only connect to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, dbName: mongoDb })
    .then(() => log.info("MongoDB database connection established successfully"))
    .catch((error) => log.error("MongoDB connection error:", error));
  
  const connection = mongoose.connection;
  connection.on('error', (error) => {
     log.error("MongoDB connection error:", error);
  });
}

// Create a Registry to register the metrics
const register = new promClient.Registry();
// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });
// Add a route for the metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    // Retrieve metrics from the registry
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Routes
const exercisesRouter = require('./routes/exercises');
app.use('/exercises', exercisesRouter);

// Error handling middleware
app.use((err, req, res) => {
  log.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    log.info(`Server is running on port: ${port}`);
  });
}

module.exports = app;