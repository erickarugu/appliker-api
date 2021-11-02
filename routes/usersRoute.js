const express = require('express');
const usersController = require('../controllers/usersController');
const { generateToken, sendToken } = require('../services/jwtService');
const authenticateToken = require('../middlewares/authenticateToken');
const usersRouter = express.Router();

exports.router = (() => {
  usersRouter.get('/', usersController.getAllUsers);
  usersRouter.get('/:displayName', authenticateToken, usersController.findOneUser);
  usersRouter.post('/signup', usersController.registerUser, generateToken, sendToken);
  usersRouter.post('/signin', usersController.loginUser, generateToken, sendToken);
  return usersRouter;
})();
