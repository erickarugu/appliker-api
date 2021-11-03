const express = require('express');
const commentsController = require('../controllers/commentsController');
const authenticateToken = require('../middlewares/authenticateToken');
const commentsRoute = express.Router();

exports.router = (() => {
  commentsRoute.get('/:postId', commentsController.getAllPostComments);
  commentsRoute.post('/:postId', authenticateToken, commentsController.createComment);
  commentsRoute.get('/comment/:commentId', commentsController.findOneComment);
  return commentsRoute;
})();
