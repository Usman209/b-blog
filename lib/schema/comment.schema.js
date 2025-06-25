const mongoose = require("mongoose");
const { Schema } = mongoose;
const { DB_Tables } = require("../utils/enum");

const CommentSchema = new Schema(
  {
    blog: { type: mongoose.Types.ObjectId, ref: DB_Tables.BLOG, required: true },
    author: { type: mongoose.Types.ObjectId, ref: DB_Tables.USER, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: DB_Tables.USER },
    updatedBy: { type: mongoose.Types.ObjectId, ref: DB_Tables.USER },
  },
  { timestamps: true }
);

module.exports = mongoose.model(DB_Tables.COMMENT, CommentSchema);
