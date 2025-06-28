const Blog = require("../../lib/schema/blog.schema");
const Comment = require('../../lib/schema/comment.schema');
const { sendResponse, errReturned } = require("../../lib/utils/dto");
const mongoose = require('mongoose');


// 🔒 CREATE blog (Author is set from token, not from client)
exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id, // enforce logged-in user as author
    };
    const blog = new Blog(blogData);
    const savedBlog = await blog.save();
    return sendResponse(res, 201, "Blog created successfully.", savedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const user = req.user;

    const filter = { author: new mongoose.Types.ObjectId(user.id) };

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate("author")
      .populate("comments");

    return sendResponse(res, 200, "Blogs retrieved successfully.", blogs);
  } catch (error) {
    return errReturned(res, error.message);
  }
};


// 📄 GET BLOG by ID
exports.getBlogById = async (req, res) => {
      console.log('here ==========',req.params.id);

  try {
    
    const blog = await Blog.findById(req.params.id)
      .populate("author")
      .populate("comments");

    if (!blog) return errReturned(res, "Blog not found.");
    return sendResponse(res, 200, "Blog retrieved successfully.", blog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

// 🔒 UPDATE BLOG (Only admin or owner can update)
exports.updateBlog = async (req, res) => {

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return errReturned(res, "Blog not found.");

    if ( blog?.author.toString() !== req?.user?.id) {
      return errReturned(res, "Unauthorized to update this blog.");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return sendResponse(res, 200, "Blog updated successfully.", updatedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

// 🔒 DELETE BLOG (Only admin or owner can delete)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return errReturned(res, "Blog not found.");

    if (blog.author.toString() !== req.user.id) {
      return errReturned(res, "Unauthorized to delete this blog.");
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, "Blog deleted successfully.", deletedBlog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};


// Public blogs list (no auth, no filter)
exports.getPublicBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName"); // ✅ only get necessary fields

    return sendResponse(res, 200, "Public blogs retrieved successfully.", blogs);
  } catch (error) {
    return errReturned(res, error.message);
  }
};



exports.getPublicBlogById = async (req, res) => {
  try {
    console.log('pk===========');
    
    const blog = await Blog.findById(req.params.id)
      .populate("author")
      .populate("comments");

    if (!blog) return errReturned(res, "Blog not found.");
    
    return sendResponse(res, 200, "Public blog retrieved successfully.", blog);
  } catch (error) {
    return errReturned(res, error.message);
  }
};
