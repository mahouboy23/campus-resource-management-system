const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Test route
app.get("/", (req, res) => {
    res.send("Campus Resource Management API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/test-user", async (req, res) => {
    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
    });

    res.json(user);
});

// I left a comment