const Booking = require("../models/Booking");
const Resource = require("../models/Resource");


// CREATE BOOKING
exports.createBooking = async (req, res) => {
    try {
        const { resource, startTime, endTime } = req.body;

        const resourceExists = await Resource.findById(resource);

        if (!resourceExists) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Check overlapping approved bookings
        const overlap = await Booking.findOne({
            resource,
            status: "approved",
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (overlap) {
            return res.status(400).json({
                message: "Resource already booked during this time"
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            resource,
            startTime,
            endTime
        });

        res.status(201).json(booking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("resource", "name type");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET MY BOOKINGS
// Supports optional query params:
//   ?filter=upcoming  → only bookings where endTime >= now
//   ?filter=past      → only bookings where endTime < now
//   (no filter)       → all bookings
exports.getMyBookings = async (req, res) => {
    try {
        const { filter } = req.query;
        const now = new Date();

        let query = { user: req.user._id };

        if (filter === "upcoming") {
            query.endTime = { $gte: now };
        } else if (filter === "past") {
            query.endTime = { $lt: now };
        }

        const bookings = await Booking.find(query)
            .populate("resource", "name type icon category")
            .sort({ startTime: filter === "past" ? -1 : 1 });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id)
            .populate("user", "name email")
            .populate("resource", "name type");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Only admin or booking owner can view
        if (
            booking.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not authorized to view this booking"
            });
        }

        res.json(booking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// DELETE BOOKING (user can only delete their own pending bookings)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Must be the owner
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to delete this booking"
            });
        }

        // Can only delete pending bookings
        if (booking.status !== "pending") {
            return res.status(400).json({
                message: "Only pending bookings can be deleted"
            });
        }

        await booking.deleteOne();

        res.json({ message: "Booking deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// GET DASHBOARD STATS (for current user)
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        const [totalBookings, upcomingBookings, pendingApproval, recentBookings] =
            await Promise.all([
                // Total bookings ever
                Booking.countDocuments({ user: userId }),

                // Upcoming = endTime in the future (approved or pending)
                Booking.countDocuments({
                    user: userId,
                    endTime: { $gte: now },
                    status: { $in: ["approved", "pending"] }
                }),

                // Pending approval
                Booking.countDocuments({
                    user: userId,
                    status: "pending"
                }),

                // 5 most recent bookings
                Booking.find({ user: userId })
                    .populate("resource", "name icon category")
                    .sort({ createdAt: -1 })
                    .limit(5)
            ]);

        res.json({
            stats: {
                totalBookings,
                upcomingBookings,
                pendingApproval
            },
            recentBookings
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// APPROVE BOOKING
exports.approveBooking = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "approved";
        await booking.save();

        res.json(booking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// REJECT BOOKING
exports.rejectBooking = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "rejected";
        await booking.save();

        res.json(booking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};