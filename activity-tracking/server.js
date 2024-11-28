const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json');
const { LogCategory } = require("./logging");
const log = new LogCategory("activity-tracking-server.js");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5300;
const mongoUri = process.env.MONGO_URI || 'mongodb://root:cfgmla23@mongodb:27017';  // Fallback to default
const mongoDb = process.env.MONGO_DB || 'activity';  // Fallback to default

// Configure CORS
const allowedOrigins = ['http://localhost:80','http://localhost'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS: ' + origin)); // Deny the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

// Middleware setup
app.use(cors(corsOptions));
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