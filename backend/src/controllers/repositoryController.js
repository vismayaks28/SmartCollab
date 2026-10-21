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
        const repository = await Repository.findById(req.params.id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        const isOwner =
            req.user &&
            repository.owner.toString() === req.user.id;

        if (repository.visibility === "private" && !isOwner) {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required to view this repository"
                });
            }

            return res.status(403).json({
                message: "You do not have access to this repository"
            });
        }

        await repository.populate("owner", "name email");
        await repository.populate("project", "title");

        return res.json(repository);

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

// Update repository settings
exports.updateRepository = async (req, res) => {
    try {
        const { name, description, visibility } = req.body;

        const repository = await Repository.findById(req.params.id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only the repository owner can update it"
            });
        }

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Repository name cannot be empty"
                });
            }

            repository.name = name.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({
                    message: "Description must be a string"
                });
            }

            repository.description = description.trim();
        }

        if (visibility !== undefined) {
            if (!["public", "private"].includes(visibility)) {
                return res.status(400).json({
                    message: "Visibility must be public or private"
                });
            }

            repository.visibility = visibility;
        }

        await repository.save();

        res.json(repository);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Delete repository
exports.deleteRepository = async (req, res) => {
    try {
        const repository = await Repository.findById(req.params.id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only the repository owner can delete it"
            });
        }

        await repository.deleteOne();

        res.json({
            message: "Repository deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};