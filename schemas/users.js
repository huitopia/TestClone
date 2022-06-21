const mongoose = require('mongoose');

const { Schema } = mongoose;

require('dotenv').config();

const UserSchema = new Schema({
  userIdx: { type: Number, required: true },
  fullName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, default: null },
});

module.exports = mongoose.model('User', UserSchema);
