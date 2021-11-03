const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    max: 2000,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);