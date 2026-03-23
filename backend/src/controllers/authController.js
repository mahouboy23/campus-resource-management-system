const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// REGISTER
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------
// ADMIN: USER MANAGEMENT
// -----------------------------------------------

// GET ALL USERS (admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE USER (admin)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE USER (admin — can set role)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({ name, email, password, role: role || "user" });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE USER (admin — name, email, password, role)
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        // Only update password if a new one is provided
        if (password && password.trim() !== "") {
            user.password = password; // pre-save hook will hash it
        }

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE USER (admin)
exports.deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ADMIN DASHBOARD STATS
exports.getAdminStats = async (req, res) => {
    try {
        const User = require("../models/User");
        const Booking = require("../models/Booking");
        const Resource = require("../models/Resource");

        const [totalUsers, totalResources, pendingBookings, totalBookings, recentBookings] =
            await Promise.all([
                User.countDocuments({ role: "user" }),
                Resource.countDocuments(),
                Booking.countDocuments({ status: "pending" }),
                Booking.countDocuments(),
                Booking.find()
                    .populate("user", "name email")
                    .populate("resource", "name icon category")
                    .sort({ createdAt: -1 })
                    .limit(6),
            ]);

        res.json({
            stats: { totalUsers, totalResources, pendingBookings, totalBookings },
            recentBookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};