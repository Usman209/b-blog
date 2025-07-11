const mongoose = require("mongoose");
const { Schema } = mongoose;
const { DB_Tables } = require("../utils/enum");

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [String],
    author: {
      type: mongoose.Types.ObjectId,
      ref: DB_Tables.USER,
      required: false
    },
    reactions: {
      likes: [{ type: mongoose.Types.ObjectId, ref: DB_Tables.USER }],
      dislikes: [{ type: mongoose.Types.ObjectId, ref: DB_Tables.USER }],
    },
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: DB_Tables.COMMENT }],
    createdBy: { type: mongoose.Types.ObjectId, ref: DB_Tables.USER },
    updatedBy: { type: mongoose.Types.ObjectId, ref: DB_Tables.USER },
  },
  { timestamps: true }
);

module.exports = mongoose.model(DB_Tables.BLOG, BlogSchema);

