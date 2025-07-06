const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const { authenticateAndAuthorize } = require("../../lib/utils/verifyToken");

// 🟢 Authenticated Users
router.get("/", authenticateAndAuthorize(["USER", "ADMIN", "MANAGER"]), Controller.getAllBlogs);


router.get('/public', Controller.getPublicBlogs); // public route

router.get('/public/:id', Controller.getPublicBlogById);

router.get("/:id", authenticateAndAuthorize(["USER", "ADMIN", "MANAGER"]), Controller.getBlogById);


router.patch("/:id/like",authenticateAndAuthorize(["USER", "ADMIN", "MANAGER"]), Controller.likeBlog);
router.patch("/:id/dislike",authenticateAndAuthorize(["USER", "ADMIN", "MANAGER"]), Controller.dislikeBlog);






// 🟡 Only authenticated users can create blogs
router.post("/", authenticateAndAuthorize(["USER", "ADMIN"]), Controller.createBlog);

// 🔴 Only ADMINs (or specific MANAGER logic) can update/delete
router.put("/:id", authenticateAndAuthorize(["ADMIN", "MANAGER","USER"]), Controller.updateBlog);
router.delete("/:id", authenticateAndAuthorize(["ADMIN", "MANAGER"]), Controller.deleteBlog);

module.exports = router;
