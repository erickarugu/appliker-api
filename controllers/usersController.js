const User = require('../models/UserModel');
const { upload } = require('../middlewares/uploadAvatar');
const uploadFunction = upload.single('avatar');
const bcrypt = require('bcrypt');

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
  }
};
