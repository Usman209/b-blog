// controllers/tagController.js
const tag = require("../../lib/schema/tag.schema");
const { sendResponse, errReturned } = require("../../lib/utils/dto");

exports.createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();
    return sendResponse(res, 201, "Tag created successfully.", savedTag);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    return sendResponse(res, 200, "Tags retrieved successfully.", tags);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return errReturned(res, "Tag not found.");
    return sendResponse(res, 200, "Tag retrieved successfully.", tag);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.updateTag = async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTag) return errReturned(res, "Tag not found.");
    return sendResponse(res, 200, "Tag updated successfully.", updatedTag);
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) return errReturned(res, "Tag not found.");
    return sendResponse(res, 200, "Tag deleted successfully.", deletedTag);
  } catch (error) {
    return errReturned(res, error.message);
  }
};
