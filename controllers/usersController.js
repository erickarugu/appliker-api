const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const { upload } = require('../middlewares/uploadAvatar');
const uploadFunction = upload.single('avatar');

module.exports = {
  // Create a user
  registerUser: (req, res, next) => {
    uploadFunction(req, res, async function (err) {
      if (err) {
        return res.status(400).send({ success: false, message: err.message });
      }
      const userData = req.body;
      // TODO: Validate all required inputs
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;

        // Attempt to save to Mongo DB
        const avatarUrl = `images/avatars/${req.file.filename}`;
        userData.avatar = avatarUrl;

        const newUser = new User({
          ...userData
        });

        const user = await newUser.save();
        req.user = user;
        next();
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Could not save the user to DB', err });
      }
    });
  },
  loginUser: async (req, res, next) => {
    try {
      let user = await User.find({ where: { email: req.body.email } });
      user = user[0];
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
        return res.status(400).json({ success: false, message: 'Wrong password.' });
      }
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
    }
  },
  findOneUser: async (req, res, next) => {
    try {
      let user = await User.find({ where: { displayName: req.params.displayName } });
      user = user[0];
      return res.status(200).json({ success: true, user });
    } catch (err) {
      return res.status(500).json(err);
      console.log(err);
    }
  },
  // Fetch all users
  getAllUsers: (req, res, next) => {
    User.find().then(users => {
      // send all the user to client
      return res.status(200).json({ success: true, length: users.length, users });
    }).catch(error => {
      return res.status(500).json({ succes: false, message: "Could not fetch users" });
    });
  },
  updateOneUser: async (req, res, next) => {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return (500).json(error);
      }
    }
    if (req.body.displayName) delete req.body.displayName;

    try {
      const user = await User.findOneAndUpdate({ where: { displayName: req.params.displayName } }, req.body);
      return res.status(200).json({ success: true, message: 'User Updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Could not update the user' });
    }
  },
  followUser: async (req, res, next) => {
    try {
      let user = await User.find({ displayName: req.params.displayName });
      console.log(req.user.id, user);
      let currentUser = await User.findOne({ _id: req.user.id });
      user = user[0];
      if (user === undefined) return res.status(404).json({ success: false, message: 'Could not find specified user' });
      if (user._id === currentUser._id) return res.status(404).json({ success: false, message: 'Cnnot follow youselft' });

      if (!user.followers.includes(req.user.id)) {
        let followers = [...user.followers, req.user.id];
        let followings = [...currentUser.followings, user.id];

        await User.findOneAndUpdate({ _id: user._id }, { followers: followers }).then(async (err, res) => {
          console.log(currentUser.displayName);
          await User.updateOne({ _id: currentUser._id }, { followings: followings });
        });
        res.status(200).json({ success: true, message: 'User followed' });
      } else {
        return res.status(403).json({ success: false, message: 'You already follow this user' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Server error!', err });
    }
    return res.status(200);
  },
  unfollowUser: async (req, res, next) => {
    console.log(req.user.id);
    try {
      let user = await User.find({ displayName: req.params.displayName });
      let currentUser = await User.findOne({ _id: req.user.id });
      user = user[0];
      if (user === undefined) return res.status(404).json({ success: false, message: 'Could not find specified user' });
      if (user.followers.includes(req.user.id)) {
        let followers = [...user.followers];
        let followings = [...currentUser.followings];

        followers.splice(followers.indexOf(req.user.id), 1);
        followings.splice(followings.indexOf(user.id), 1);
        await User.findOneAndUpdate({ displayName: req.params.displayName }, { followers: followers }).then(async (err, res) => {
          await User.updateOne({ displayName: currentUser.displayName }, { followings: followings });
        });

        res.status(200).json({ success: true, message: 'User unfollowed' });
      } else {
        return res.status(403).json({ success: false, message: 'You dont follow this user' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Server error!', err });
    }
    return res.status(200);
  },
  logoutUser: async (req, res, next) => {
    try {
      let savedToken = await Token.findOne({ userId: req.user.id });
      if (savedToken) {
        await Token.deleteOne({ userId: req.user.is });
        res.status(200).json({ success: true, message: 'User logged out' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error!', err });
    }
  }
};
