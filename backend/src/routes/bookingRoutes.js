const express = require("express");
const router = express.Router();

const {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    approveBooking,
    rejectBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");


// Create booking
router.post("/", protect, createBooking);

// My bookings
router.get("/my", protect, getMyBookings);

// Single booking
router.get("/:id", protect, getBookingById);

// Admin: all bookings
router.get("/", protect, adminOnly, getAllBookings);

// Admin approve
router.put("/:id/approve", protect, adminOnly, approveBooking);

// Admin reject
router.put("/:id/reject", protect, adminOnly, rejectBooking);

module.exports = router;