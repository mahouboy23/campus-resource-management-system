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
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().populate("createdBy", "name email");

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