const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: ["room", "equipment", "device", "other"],
        },

        description: {
            type: String,
            default: "",
        },

        icon: {
            type: String,
            default: "📦",
        },

        availabilityStatus: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);