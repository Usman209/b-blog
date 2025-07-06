

// controllers/commentController.js
const blogSchema = require("../../lib/schema/blog.schema");
const Comment = require("../../lib/schema/comment.schema");
const { sendResponse, errReturned } = require("../../lib/utils/dto");


// controller.js
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, blog } = req.body;

    if (!content || !blog) return errReturned(res, "Content and blog ID are required");

    // 1. Create the comment
    const comment = await Comment.create({
      content,
      blog,
      author: userId
    });

    // 2. Push comment ID to blog
    await blogSchema.findByIdAndUpdate(blog, {
      $push: { comments: comment._id }
    });

    // 3. Populate author
    const populated = await comment.populate("author", "firstName lastName");

    return sendResponse(res, 201, "Comment created successfully.", populated);
  } catch (error) {
    console.error("[createComment]", error);
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
