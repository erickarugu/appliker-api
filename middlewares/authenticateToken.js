const jwt = require('jsonwebtoken');
const Token = require('../models/UserLoginModel');
const { ACCESS_TOKEN_SECRET } = process.env;

authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const bearer = authHeader && authHeader.split(' ')[0];
  if (bearer !== 'Bearer') return res.status(401).json({ success: false, error: 'Bearer not detected' });

  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.status(401).json({ success: false, error: 'Token not detected' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res.status(400).json({ success: false, error: "Could not verify token" });
    }
    req.user = payload;
    next();
  });
};
module.exports = authenticateToken;