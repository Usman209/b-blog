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

    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const filter = { author: new mongoose.Types.ObjectId(user.id) };

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "firstName lastName")
      .populate("comments");

    return sendResponse(res, 200, "Blogs retrieved successfully.", blogs);
  } catch (error) {
    return errReturned(res, error.message);
  }
};



// 📄 GET BLOG by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "firstName lastName") // ✅ populate blog author with selected fields
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName"           // ✅ populate comment authors
        }
      });

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
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "firstName lastName");

    const enrichedBlogs = blogs.map(blog => {
      const blogObj = blog.toObject();
      blogObj.likesCount = blog.reactions?.likes?.length || 0;
      blogObj.commentsCount = blog.comments?.length || 0;
      return blogObj;
    });

    return sendResponse(res, 200, "Public blogs retrieved successfully.", enrichedBlogs);
  } catch (error) {
    return errReturned(res, error.message);
  }
};







exports.getPublicBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'firstName lastName')         // populate blog author
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName'                  // ✅ populate each comment's author
        }
      });

    if (!blog) return errReturned(res, 'Blog not found');
    return sendResponse(res, 200, 'Blog fetched', blog);
  } catch (err) {
    console.log(err);
    return errReturned(res, err.message);
  }
};




// PATCH /api/blogs/:id/like
exports.likeBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return sendResponse(res, 404, "Blog not found");

    // Ensure arrays are initialized
    blog.reactions.likes = blog.reactions.likes || [];
    blog.reactions.dislikes = blog.reactions.dislikes || [];

    const liked = blog.reactions.likes.includes(userId);
    const disliked = blog.reactions.dislikes.includes(userId);

    if (liked) {
      // Remove like (toggle off)
      blog.reactions.likes.pull(userId);
    } else {
      // Add like and remove from dislikes
      blog.reactions.likes.push(userId);
      if (disliked) {
        blog.reactions.dislikes.pull(userId);
      }
    }

    await blog.save();
    return sendResponse(res, 200, "Like updated", blog);
  } catch (err) {
    return errReturned(res, err.message);
  }
};



// PATCH /api/blogs/:id/dislike
exports.dislikeBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return sendResponse(res, 404, "Blog not found");

    // Ensure arrays are initialized
    blog.reactions.likes = blog.reactions.likes || [];
    blog.reactions.dislikes = blog.reactions.dislikes || [];

    const liked = blog.reactions.likes.includes(userId);
    const disliked = blog.reactions.dislikes.includes(userId);

    if (disliked) {
      // Remove dislike (toggle off)
      blog.reactions.dislikes.pull(userId);
    } else {
      // Add dislike and remove from likes
      blog.reactions.dislikes.push(userId);
      if (liked) {
        blog.reactions.likes.pull(userId);
      }
    }

    await blog.save();
    return sendResponse(res, 200, "Dislike updated", blog);
  } catch (err) {
    return errReturned(res, err.message);
  }
};




