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
exports.getMyBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({ user: req.user._id })
            .populate("resource", "name type");

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