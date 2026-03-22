const express = require("express");
const router = express.Router();

const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    deleteBooking,
    getDashboardStats,
    approveBooking,
    rejectBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");


// Dashboard stats (user)
router.get("/dashboard/stats", protect, getDashboardStats);

// Create booking
router.post("/", protect, createBooking);

// My bookings (supports ?filter=upcoming|past)
router.get("/my", protect, getMyBookings);

// Delete a pending booking (user)
router.delete("/:id", protect, deleteBooking);

// Single booking
router.get("/:id", protect, getBookingById);

// Admin: all bookings
router.get("/", protect, adminOnly, getAllBookings);

// Admin approve
router.put("/:id/approve", protect, adminOnly, approveBooking);

// Admin reject
router.put("/:id/reject", protect, adminOnly, rejectBooking);

module.exports = router;