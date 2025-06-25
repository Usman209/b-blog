

// controllers/commentController.js
const Comment = require("../../lib/schema/comment.schema");
const { sendResponse, errReturned } = require("../../lib/utils/dto");

exports.createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    return sendResponse(res, 201, "Comment created successfully.", savedComment);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("author").populate("blog");
    return sendResponse(res, 200, "Comments retrieved successfully.", comments);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("author").populate("blog");
    if (!comment) return errReturned(res, "Comment not found.");
    return sendResponse(res, 200, "Comment retrieved successfully.", comment);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedComment) return errReturned(res, "Comment not found.");
    return sendResponse(res, 200, "Comment updated successfully.", updatedComment);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) return errReturned(res, "Comment not found.");
    return sendResponse(res, 200, "Comment deleted successfully.", deletedComment);
  } catch (error) {
    return errReturned(res, error.message);
  }
};
