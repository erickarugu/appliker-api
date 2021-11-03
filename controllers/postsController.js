const bcrypt = require('bcrypt');
const Post = require('../models/PostModel');
const { upload } = require('../middlewares/uploadPostImage');
const uploadFunction = upload.single('image');

module.exports = {
  // Create a post
  createPost: (req, res, next) => {
    uploadFunction(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ success: false, message: err.message });
      }
      const postData = req.body;
      // TODO: Validate all required inputs
      try {

        // Attempt to save to Mongo DB
        const postImageUrl = `images/posts/${req.file.filename}`;
        postData.postImage = postImageUrl;

        const newPost = new Post({
          ...postData,
          userId: req.user.id
        });

        const post = await newPost.save();
        req.post = post;
        return res.status(200).json({ success: true, message: 'Post created successfully' });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Could not save the post to DB', err });
      }
    });
  },
  findOnePost: async (req, res, next) => {
    try {
      let post = await Post.findOne({ _id: req.params.postId });
      return res.status(200).json({ success: true, post });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Fetch all posts
  getAllPosts: (req, res, next) => {
    Post.find().then(posts => {
      // send all the post to client
      return res.status(200).json({ success: true, length: posts.length, posts });
    }).catch(error => {
      return res.status(500).json({ succes: false, message: "Could not fetch posts" });
    });
  },
  updateOnePost: async (req, res, next) => {
    try {
      const post = await Post.updateOne({ _id: req.params.postId }, req.body);
      return res.status(200).json({ success: true, message: 'Post Updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Could not update the post' });
    }
  },
};