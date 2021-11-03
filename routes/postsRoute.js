const express = require('express');
const postsController = require('../controllers/postsController');
const authenticateToken = require('../middlewares/authenticateToken');
const postsRouter = express.Router();

exports.router = (() => {
  postsRouter.get('/', postsController.getAllPosts);
  postsRouter.post('/', authenticateToken, postsController.createPost);
  postsRouter.get('/:postId', postsController.findOnePost);
  postsRouter.delete('/:postId', postsController.deleteOnePost);
  postsRouter.put('/:postId', authenticateToken, postsController.updateOnePost);
  postsRouter.post('/like/:postId', authenticateToken, postsController.likePost);
  postsRouter.post('/unlike/:postId', authenticateToken, postsController.unlikePost);
  return postsRouter;
})();
