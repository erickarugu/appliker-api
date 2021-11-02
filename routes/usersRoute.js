const express = require('express');
const usersController = require('../controllers/usersController');
const { generateToken, sendToken } = require('../services/jwtService');
const usersRouter = express.Router();

exports.router = (() => {
  usersRouter.get('/', usersController.getAllUsers);
  usersRouter.post('/signup', usersController.createUser, generateToken, sendToken);
  return usersRouter;
})();
