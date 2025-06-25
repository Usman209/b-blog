// controllers/blogController.js
const Blog = require("../../lib/schema/blog.schema");
const { sendResponse, errReturned } = require("../../lib/utils/dto");

exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    return sendResponse(res, 201, "Blog created successfully.", savedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author").populate("comments");
    return sendResponse(res, 200, "Blogs retrieved successfully.", blogs);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author").populate("comments");
    if (!blog) return errReturned(res, "Blog not found.");
    return sendResponse(res, 200, "Blog retrieved successfully.", blog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) return errReturned(res, "Blog not found.");
    return sendResponse(res, 200, "Blog updated successfully.", updatedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return errReturned(res, "Blog not found.");
    return sendResponse(res, 200, "Blog deleted successfully.", deletedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};
