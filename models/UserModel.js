const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    min: 3, max: 20, unique: true
  },
  firstName: {
    type: String,
    required: true,
    min: 3, max: 20
  },
  lastName: {
    type: String,
    required: true,
    min: 3, max: 20
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  avatar: {
    type: String,
    required: true
  },
  followings: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    required: false,
    max: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);