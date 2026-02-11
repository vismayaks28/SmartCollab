const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");


router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activities" });
    }
});

module.exports = router;
