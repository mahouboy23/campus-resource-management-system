const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resource",
            required: true,
        },
        start_time: {
            type: Date,
            required: true,
        },
        end_time: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);