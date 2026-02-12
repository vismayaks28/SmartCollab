const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");

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
            `Created project ${project.name}`
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


// Deleting project possible only by the owner
exports.deleteProject = async(req,res)=>{
    try{
        const project = await Project.findById(req.params.id);

        if(project.owner.toString() !== req.user.id){
            return res.status(403).json({
                message:"Not authorized"
            });
        }

        await project.deleteOne();

        await logActivity(
            req.user.id,
            "DELETE_PROJECT",
            `Deleted project ${project.name}`
        );

        res.json({message:"Project deleted"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};
