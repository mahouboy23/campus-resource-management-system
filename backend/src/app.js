const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();


// --------------------
// Connect Database
// --------------------
connectDB();


// --------------------
// Global Middlewares
// --------------------
app.use(cors());
app.use(express.json());


// --------------------
// API Routes
// --------------------

// Authentication routes
app.use("/api/auth", authRoutes);

// Resource management routes
app.use("/api/resources", resourceRoutes);

// Booking management routes
app.use("/api/bookings", bookingRoutes);


// --------------------
// Base Route
// --------------------
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Campus Resource Management API running",
    });
});


// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});


// --------------------
// Global Error Handler
// --------------------
app.use(errorHandler);


// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});