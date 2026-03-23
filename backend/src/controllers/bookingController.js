const Booking = require("../models/Booking");
const Resource = require("../models/Resource");


// CREATE BOOKING — strict double-booking prevention (blocks approved AND pending overlaps)
exports.createBooking = async (req, res) => {
    try {
        const { resource, startTime, endTime } = req.body;

        const resourceExists = await Resource.findById(resource);
        if (!resourceExists) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Block if any approved OR pending booking overlaps the requested slot
        const overlap = await Booking.findOne({
            resource,
            status: { $in: ["approved", "pending"] },
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) },
        });

        if (overlap) {
            const label = overlap.status === "approved" ? "approved" : "pending approval";
            return res.status(400).json({
                message: `This resource already has a ${label} booking during that time.`,
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            resource,
            startTime,
            endTime,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET ALL BOOKINGS (ADMIN)
// Supports ?status=pending|approved|rejected  and  ?user=<userId>
exports.getAllBookings = async (req, res) => {
    try {
        const { status, user } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (user) filter.user = user;

        const bookings = await Booking.find(filter)
            .populate("user", "name email")
            .populate("resource", "name icon category")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET MY BOOKINGS — supports ?filter=upcoming|past
exports.getMyBookings = async (req, res) => {
    try {
        const { filter } = req.query;
        const now = new Date();
        let query = { user: req.user._id };

        if (filter === "upcoming") query.endTime = { $gte: now };
        else if (filter === "past") query.endTime = { $lt: now };

        const bookings = await Booking.find(query)
            .populate("resource", "name type icon category")
            .sort({ startTime: filter === "past" ? -1 : 1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET BOOKINGS FOR A SPECIFIC RESOURCE (calendar highlight — future approved/pending only)
exports.getResourceBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookings = await Booking.find({
            resource: req.params.resourceId,
            status: { $in: ["approved", "pending"] },
            endTime: { $gte: today },
        }).select("startTime endTime status");

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

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (
            booking.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized to view this booking" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE BOOKING (user — own pending bookings only)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this booking" });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Only pending bookings can be deleted" });
        }

        await booking.deleteOne();
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET USER DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        const [totalBookings, upcomingBookings, pendingApproval, recentBookings] =
            await Promise.all([
                Booking.countDocuments({ user: userId }),
                Booking.countDocuments({
                    user: userId,
                    endTime: { $gte: now },
                    status: { $in: ["approved", "pending"] },
                }),
                Booking.countDocuments({ user: userId, status: "pending" }),
                Booking.find({ user: userId })
                    .populate("resource", "name icon category")
                    .sort({ createdAt: -1 })
                    .limit(5),
            ]);

        res.json({
            stats: { totalBookings, upcomingBookings, pendingApproval },
            recentBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// APPROVE BOOKING
exports.approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
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
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        booking.status = "rejected";
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};