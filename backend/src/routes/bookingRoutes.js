const express = require("express");
const router = express.Router();

const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    deleteBooking,
    getDashboardStats,
    getResourceBookings,
    approveBooking,
    rejectBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// User dashboard stats
router.get("/dashboard/stats", protect, getDashboardStats);

// Bookings for a specific resource (calendar highlight)
router.get("/resource/:resourceId", protect, getResourceBookings);

// Create booking
router.post("/", protect, createBooking);

// My bookings (supports ?filter=upcoming|past)
router.get("/my", protect, getMyBookings);

// Admin: all bookings (supports ?status=&user=)
router.get("/", protect, adminOnly, getAllBookings);

// Single booking
router.get("/:id", protect, getBookingById);

// Delete pending booking (user)
router.delete("/:id", protect, deleteBooking);

// Admin: approve / reject
router.put("/:id/approve", protect, adminOnly, approveBooking);
router.put("/:id/reject", protect, adminOnly, rejectBooking);

module.exports = router;