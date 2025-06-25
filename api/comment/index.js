// routes/districtRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("./controller");

// Define routes
router.post("/", Controller.createComment); 
router.get("/", Controller.getAllComments); 
router.get("/:id", Controller.getCommentById); 
router.put("/:id", Controller.updateComment); 
router.delete("/:id", Controller.deleteComment); 

module.exports = router;
