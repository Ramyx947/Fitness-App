const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const promClient = require('prom-client');
const helmet = require("helmet");
require('dotenv').config(); 
const config = require('./config.json');
const corsConfig = require('./config');

const { LogCategory } = require("./logging");
const log = new LogCategory("activity-tracking-server.js");


const app = express();
const port = process.env.PORT || 5300;
const mongoUri = process.env.MONGO_URI || 'mongodb://root:cfgmla23@mongodb:27017/activity?authSource=admin'
const mongoDb = process.env.MONGO_DB || 'activity'

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    const { allowedOrigins = [] } = corsConfig[process.env.NODE_ENV || 'development'] || corsConfig.development;

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS: ' + origin)); // Deny the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

// Middleware setup
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB only if not in test environment
console.log('Final MongoDB URI!!?!?!?!?!?!?!??S:', mongoUri); 
if (process.env.NODE_ENV !== 'test' && mongoose.connection.readyState === 0) { // Check if not already connected and not testing
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      dbName: mongoDb,
      useUnifiedTopology: true,
    })
    .then(() => log.info("MongoDB database connection established successfully"))
    .catch((error) => {
      log.error("MongoDB connection error:", error);
      console.error("MongoDB connection error:", error);
    });

  const connection = mongoose.connection;
  connection.on('error', (error) => {
    console.error("mongoUri", mongoUri)
    console.error("MongoDB connection error:", error);
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

// Correct Error handling middleware (add 'next')
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    log.info(`Server is running on port: ${port}`);
  });
}

module.exports = app;