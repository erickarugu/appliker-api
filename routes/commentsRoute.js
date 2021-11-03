const express = require('express');
const commentsController = require('../controllers/commentsController');
const authenticateToken = require('../middlewares/authenticateToken');
const commentsRoute = express.Router();

exports.router = (() => {
  commentsRoute.get('/:postId', commentsController.getAllPostComments);
  commentsRoute.post('/:postId', authenticateToken, commentsController.createComment);
  commentsRoute.post('/like/:commentId', authenticateToken, commentsController.likeComment);
  commentsRoute.post('/unlike/:commentId', authenticateToken, commentsController.unlikeComment);
  return commentsRoute;
})();
