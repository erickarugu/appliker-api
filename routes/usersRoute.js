const express = require('express');
const usersController = require('../controllers/usersController');
const { generateToken, sendToken } = require('../services/jwtService');
const authenticateToken = require('../middlewares/authenticateToken');
const usersRouter = express.Router();

exports.router = (() => {
  usersRouter.get('/', usersController.getAllUsers);
  usersRouter.get('/:displayName', authenticateToken, usersController.findOneUser);
  usersRouter.put('/:displayName', authenticateToken, usersController.updateOneUser);
  usersRouter.get('/logout', authenticateToken, usersController.logoutUser);
  usersRouter.post('/signup', usersController.registerUser, generateToken, sendToken);
  usersRouter.post('/signin', usersController.loginUser, generateToken, sendToken);
  usersRouter.post('/follow/:displayName', authenticateToken, usersController.followUser);
  usersRouter.post('/unfollow/:displayName', authenticateToken, usersController.unfollowUser);
  return usersRouter;
})();
