const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAdminStats,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin: dashboard stats
router.get("/admin/stats", protect, adminOnly, getAdminStats);

// Admin: user management
router.get("/users", protect, adminOnly, getAllUsers);
router.post("/users", protect, adminOnly, createUser);
router.get("/users/:id", protect, adminOnly, getUserById);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;