const mongoose = require("mongoose");

const { Schema } = mongoose;

require("dotenv").config();

const PostSchema = new Schema({
  postIdx: { type: Number, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  userIdx: { type: Number, required: true },
  userName: { type: String, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
