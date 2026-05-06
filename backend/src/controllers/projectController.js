const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");
const Task = require("../models/Task");
const User = require("../models/User");

// create project
exports.createProject = async(req,res)=>{
    try{
        const project = await Project.create({
            ...req.body,
            owner:req.user.id,
            members:[req.user.id]
        });

        await logActivity(
            req.user.id,
            "CREATE_PROJECT",
            `Created project ${project.title}`
        );

        res.status(201).json(project);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

//get created project
exports.getProjects = async(req,res)=>{
    try{
        const projects = await Project.find({
            members:req.user.id
        }).populate("owner","name email");

        res.json(projects);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

// inviting user to project for collaboration


exports.inviteUserToProject = async (req, res) => {
    try {
        const { email } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only owner can invite the users
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only project owner can invite users"
            });
        }

        // finding user(using email)
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({
                message: "User not found"
            });
        }

    
        if (project.members.includes(userToInvite._id)) {
            return res.status(400).json({
                message: "User already a project member"
            });
        }

        // Adding member
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

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// Deleting project possible only by the owner
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

       
        await Task.deleteMany({ project: project._id });
        await project.deleteOne();
        
        await logActivity(
            req.user.id,
            "DELETE_PROJECT",
            `Deleted project ${project.title}`
        );
       res.json({
            message: "Project deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

