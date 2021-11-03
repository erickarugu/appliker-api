const Comment = require('../models/CommentModel');
const Post = require('../models/PostModel');

module.exports = {
  // Create a post
  createComment: async (req, res, next) => {
    const commentData = req.body;
    try {
      // Save to DB
      let post = await Post.findOne({ _id: req.params.postId });
      if (!post) return res.status(404).json({ success: false, message: 'Could not find specified post' });

      const newcomment = new Comment({
        ...commentData,
        userId: req.user.id,
        postId: req.params.postId
      });
      console.log(commentData, req.user.id);

      await newcomment.save();
      return res.status(200).json({ success: true, message: 'comment created successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Could not save the comment to DB', err });
    }
  },
  findOneComment: async (req, res, next) => {
    try {
      let comment = await Comment.findOne({ _id: req.params.commentId });
      return res.status(200).json({ success: true, comment });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Fetch all posts
  getAllPostComments: (req, res, next) => {
    Comment.find({ where: { postId: req.params.postId } }).then(comments => {
      // send all the post to client
      return res.status(200).json({ success: true, length: comments.length, comments });
    }).catch(error => {
      return res.status(500).json({ succes: false, message: "Could not fetch comments" });
    });
  },
};