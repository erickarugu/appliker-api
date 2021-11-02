const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: false,
    default: null
  },
  device: {
    type: String,
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Token', TokenSchema);