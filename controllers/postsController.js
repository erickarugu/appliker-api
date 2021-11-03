const bcrypt = require('bcrypt');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { upload } = require('../middlewares/uploadPostImage');
const uploadFunction = upload.single('postImage');

module.exports = {
  // Create a post
  createPost: (req, res, next) => {
    uploadFunction(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ success: false, message: err.message });
      }
      const postData = req.body;
      try {

        // Save to Database
        const postImageUrl = `images/posts/${req.file.filename}`;
        postData.postImage = postImageUrl;

        const newPost = new Post({
          ...postData,
          userId: req.user.id
        });
        const post = await newPost.save();
        return res.status(200).json({ success: true, message: 'Post created successfully', post });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Could not save the post to DB', err });
      }
    });
  },
  findOnePost: async (req, res, next) => {
    try {
      let post = await Post.findOne({ _id: req.params.postId });
      if (!post) res.status(404);
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
  deleteOnePost: async (req, res, next) => {
    try {
      await Post.deleteOne({ _id: req.params.postId });
      return res.status(200).json({ success: true, message: 'Post Deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Could not update the post' });
    }
  },
  likePost: async (req, res, next) => {
    try {
      let user = await User.findOne({ _id: req.user.id });
      let post = await Post.findOne({ _id: req.params.postId });
      console.log(post);
      if (!post) return res.status(404).json({ success: false, message: 'Could not find specified post' });

      if (!user.likes.includes(req.params.postId)) {
        let likes = [...user.likes, req.params.postId];

        await User.updateOne({ displayName: user.displayName }, { likes: likes });

        res.status(200).json({ success: true, message: 'Post Liked' });
      } else {
        return res.status(403).json({ success: false, message: 'You already like this post' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Server error!', err });
    }
    return res.status(200);
  },
  unlikePost: async (req, res, next) => {
    try {
      let user = await User.findOne({ _id: req.user.id });
      let post = await Post.findOne({ _id: req.params.postId });
      if (!post) return res.status(404).json({ success: false, message: 'Could not find specified post' });

      if (user.likes.includes(req.params.postId)) {
        let likes = [...user.likes];
        likes.splice(likes.indexOf(req.params.postId), 1);
        await User.updateOne({ displayName: user.displayName }, { likes: likes });

        res.status(200).json({ success: true, message: 'Post unLiked.' });
      } else {
        return res.status(403).json({ success: false, message: 'You don\'t like this post' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Server error!', err });
    }
    return res.status(200);
  },
};