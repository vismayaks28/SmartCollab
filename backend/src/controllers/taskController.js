const Task = require("../models/Task");
const Project = require("../models/Project");
const logActivity = require("../utils/logActivity");

//create task -------

exports.createTask = async(req,res)=>{
   
    try{

        const project = await Project.findById(req.body.project);
        if (!project) {
            return res.status(404).json({
            message: "Project not found"
            });
        }
        if(!project.members.includes(req.user.id)){
            return res.status(403).json({
                message:"Not a project member"
            });
        }

        const task = await Task.create(req.body);

        await logActivity(
            req.user.id,
            "CREATE_TASK",
            `Created task ${task.title}`
        );

        res.status(201).json(task);

    }catch(err){
        res.status(500).json({error:err.message});
    }
};


// get task ----

exports.getTasks = async(req,res)=>{

    try{
        const tasks = await Task.find({
            project:req.params.projectId
        }).populate("assignedTo","name");

        res.json(tasks);

    }catch(err){
        res.status(500).json({error:err.message});
    }
};


// Update task------

exports.updateTask = async(req,res)=>{

    try{

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        const project = await Project.findById(task.project);

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await logActivity(
            req.user.id,
            "UPDATE_TASK",
            `Updated task ${task.title}`
        );

        res.json(task);

    }catch(err){
        res.status(500).json({error:err.message});
    }
};


// Deleting task----- 

exports.deleteTask = async(req,res)=>{
    
    try{

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
             message: "Task not found"
             });
        }

        const project = await Project.findById(task.project);

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await task.deleteOne();

        await logActivity(
            req.user.id,
            "DELETE_TASK",
            `Deleted task ${task.title}`
        );

        res.json({message:"Task deleted"});

    }catch(err){
        res.status(500).json({error:err.message});
    }
};
