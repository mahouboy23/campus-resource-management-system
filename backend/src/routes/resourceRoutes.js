const express = require("express");
const router = express.Router();

const {
    createResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource,
} = require("../controllers/resourceController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");


// Create resource (admin only)
router.post("/", protect, adminOnly, createResource);


// Get all resources (everyone)
router.get("/", protect, getAllResources);


// Get single resource
router.get("/:id", protect, getResourceById);


// Update resource (admin only)
router.put("/:id", protect, adminOnly, updateResource);


// Delete resource (admin only)
router.delete("/:id", protect, adminOnly, deleteResource);

module.exports = router;