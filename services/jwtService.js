const jwt = require('jsonwebtoken');
const customId = require('custom-id');
const { ACCESS_TOKEN_SECRET, APP_URL } = process.env;
const Token = require('../models/UserLoginModel');

const createToken = async (req) => {
  const token_id = await customId({
    user_id: req.user._id,
    date: Date.now(),
    randomLength: 4
  });
  const ip = (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  const newUserToken = await Token({
    userId: req.user._id,
    ipAddress: ip,
    device: req.headers["user-agent"] || null,
    tokenId: token_id
  });
  // Save the user login
  await newUserToken.save(async err => {
    if (err) {
      console.log(err);
      return;
    }
  });
  const token_user = { id: req.user._id, token_id };
  const accessToken = await jwt.sign(token_user, ACCESS_TOKEN_SECRET);
  return accessToken;
};
module.exports = {
  generateToken: async (req, res, next) => {
    let result = await createToken(req);
    req.token = result;
    return next();
  },
  sendToken: async (req, res, next) => {
    const responseObj = {
      success: true,
      message: "User logged in",
      token: req.token,
      user: req.user
    };
    return res.status(200).json(responseObj);
  }
};