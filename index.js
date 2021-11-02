const express = require("express");
const dev = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
// Routes
const usersRoute = require('./routes/usersRoute');

// Initialize the express app
const app = express();

// Connect to the database
if (process.env.NODE_ENV == "development") {
  mongoose.connect(process.env.MONGO_DEV_URL, {
    useNewUrlParser: true, useUnifiedTopology: true

  }).then(() => console.log('Development Mongo DB connected'))
    .catch(err => console.log(err));
} else if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.MONGO_PROD_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
    useFindAndModify: true,
  }, () => {
    try {
      console.log('Production Mongo DB connected');
    } catch (error) {
      console.log(error);
    }
  }); ``;
} else {
  console.log('Testing Mongo DB connected');
}
// Log requests in development mode only
if (process.env.NODE_ENV == "development") {
  app.use(dev('common'));
}
// Middlewares
// app.use(helmet());
// Parse json from request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve files in public folder
app.use(express.static('public'));



// ROUTES
// Entry route
app.get('/api/v1', (req, res, next) => {
  res.json({ message: 'Hi There, Welcome to App Liker V1 API!' });
});

app.use('/api/v1/users', usersRoute.router);

// 
module.exports = app;