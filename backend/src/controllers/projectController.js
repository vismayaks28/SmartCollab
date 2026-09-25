const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");
const Task = require("../models/Task");
const User = require("../models/User");

// Create project
exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Project title is required"
            });
        }

        const project = await Project.create({
            title: title.trim(),
            description,
            owner: req.user.id,
            members: [req.user.id]
        });

        await logActivity(
            req.user.id,
            "CREATE_PROJECT",
            project._id,
            "Project"
        );

        res.status(201).json(project);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Get projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user.id
        }).populate("owner", "name email");

        res.json(projects);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Invite user to project
exports.inviteUserToProject = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "User email is required"
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can invite users
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only project owner can invite users"
            });
        }

        const userToInvite = await User.findOne({ email });

        if (!userToInvite) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const alreadyMember = project.members.some(
            member => member.toString() === userToInvite._id.toString()
        );

        if (alreadyMember) {
            return res.status(400).json({
                message: "User already a project member"
            });
        }

        project.members.push(userToInvite._id);

        await project.save();

        await logActivity(
            req.user.id,
            "USER_INVITED",
            project._id,
            "Project"
        );

        res.json({
            message: "User invited successfully",
            project
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only project owner can delete
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const projectId = project._id;

        // Delete all tasks belonging to the project
        await Task.deleteMany({
            project: projectId
        });

        await project.deleteOne();

        await logActivity(
            req.user.id,
            "DELETE_PROJECT",
            projectId,
            "Project"
        );

        res.json({
            message: "Project deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};