const Task = require("../models/Task");
const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");

// Create task
exports.createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            status,
            priority
        } = req.body;

        if (!title || !project) {
            return res.status(400).json({
                message: "Title and project are required"
            });
        }

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember = existingProject.members.some(
            member => member.toString() === req.user.id
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not a project member"
            });
        }

        if (assignedTo) {
            const isAssignedUserMember = existingProject.members.some(
                member => member.toString() === assignedTo
            );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    message: "Assigned user must be a project member"
                });
            }
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            status,
            priority
        });

        await logActivity(
            req.user.id,
            "CREATE_TASK",
            task._id,
            "Task"
        );

        res.status(201).json(task);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Get tasks for a project
exports.getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember = project.members.some(
            member => member.toString() === req.user.id
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const tasks = await Task.find({
            project: projectId
        })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.json(tasks);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember = project.members.some(
            member => member.toString() === req.user.id
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "assignedTo",
            "status",
            "priority"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.assignedTo) {
            const isAssignedUserMember = project.members.some(
                member => member.toString() === updates.assignedTo
            );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    message: "Assigned user must be a project member"
                });
            }
        }

        Object.assign(task, updates);

        await task.save();

        await logActivity(
            req.user.id,
            "UPDATE_TASK",
            task._id,
            "Task"
        );

        res.json(task);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};


// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const isMember = project.members.some(
            member => member.toString() === req.user.id
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await task.deleteOne();

        await logActivity(
            req.user.id,
            "DELETE_TASK",
            task._id,
            "Task"
        );

        res.json({
            message: "Task deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};