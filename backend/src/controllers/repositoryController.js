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