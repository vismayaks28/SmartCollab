const Repository = require("../models/Repository");

exports.createRepository = async (req, res) => {
    try {
        const { name, description, visibility, project } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Repository name is required"
            });
        }

        const repository = await Repository.create({
            name: name.trim(),
            description: description || "",
            visibility: visibility || "private",
            project: project || null,
            owner: req.user.id
        });

        res.status(201).json(repository);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// get repository

exports.getRepositories = async (req, res) => {
    try {
        const repositories = await Repository.find({
            owner: req.user.id
        })
            .populate("owner", "name email")
            .populate("project", "title");
            

        res.json(repositories);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getRepository = async (req, res) => {
    try {
        const repository = await Repository.findById(req.params.id)
            .populate("owner", "name email")
            .populate("project", "title");

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        res.json(repository);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

