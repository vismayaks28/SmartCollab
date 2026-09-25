const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getDashboard = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user.id
        });

        const projectIds = projects.map(p => p._id);

        // Get all tasks in those projects
        const tasks = await Task.find({
            project: { $in: projectIds }
        });

        const totalProjects = projects.length;
        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            t => t.status === "completed"
        ).length;

        const pendingTasks = tasks.filter(
            t => t.status !== "completed"
        ).length;

        res.json({
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};