// routes/districtRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("./controller");

// Define routes
router.post("/", Controller.createTag); 
router.get("/", Controller.getAllTags); 
router.get("/:id", Controller.getTagById); 
router.put("/:id", Controller.updateTag); 
router.delete("/:id", Controller.deleteTag); 

module.exports = router;
