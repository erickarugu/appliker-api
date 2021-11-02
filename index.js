const express = require("express");
const dev = require('morgan');

// Initialize the express app
const app = express();

// Middlewares
// Parse json from request body
app.use(express.json());

// Log requests in development mode only
if (process.env.NODE_ENV == "development") {
  app.use(dev('common'));
}

module.exports = app;