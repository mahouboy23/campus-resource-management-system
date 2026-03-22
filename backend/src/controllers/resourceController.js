const Resource = require("../models/Resource");


// CREATE RESOURCE (ADMIN)
exports.createResource = async (req, res) => {
    try {
        const { name, category, description, icon } = req.body;

        const resource = await Resource.create({
            name,
            category,
            description,
            icon,
            createdBy: req.user.id,
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET ALL RESOURCES
// Supports optional query params:
//   ?sortBy=availability  → available first, then unavailable
//   ?sortBy=category      → alphabetical by category
//   ?category=room|equipment|device|other  → filter by category
exports.getAllResources = async (req, res) => {
    try {
        const { sortBy, category } = req.query;

        // Build filter query
        const filter = {};
        if (category) {
            filter.category = category;
        }

        // Build sort query
        let sort = { createdAt: -1 }; // default: newest first

        if (sortBy === "availability") {
            // availabilityStatus: true (1) comes before false (-1) → descending sort
            sort = { availabilityStatus: -1, name: 1 };
        } else if (sortBy === "category") {
            sort = { category: 1, name: 1 };
        }

        const resources = await Resource.find(filter)
            .populate("createdBy", "name email")
            .sort(sort);

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET SINGLE RESOURCE
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE RESOURCE (ADMIN)
exports.updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE RESOURCE (ADMIN)
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};