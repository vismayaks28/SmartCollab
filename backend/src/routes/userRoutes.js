const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user
router.post("/", async(req,res)=>{
    try{
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// Get users
router.get("/", async(req,res)=>{
    const users = await User.find();
    res.json(users);
});

module.exports = router;
