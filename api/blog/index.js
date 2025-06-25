// routes/districtRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("./controller");

// Define routes
router.post("/", Controller.createBlog); 
router.get("/", Controller.getAllBlogs); 
router.get("/:id", Controller.getBlogById); 
router.put("/:id", Controller.updateBlog); 
router.delete("/:id", Controller.deleteBlog); 

module.exports = router;
