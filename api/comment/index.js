// routes/districtRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const { authenticateAndAuthorize } = require("../../lib/utils/verifyToken");


// Define routes
router.post("/",  authenticateAndAuthorize(["USER", "ADMIN", "MANAGER"]),Controller.createComment); 
router.get("/", Controller.getAllComments); 
router.get("/:id", Controller.getCommentById); 
router.put("/:id", Controller.updateComment); 
router.delete("/:id", Controller.deleteComment); 

module.exports = router;
