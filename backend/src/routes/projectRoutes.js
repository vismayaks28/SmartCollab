const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    deleteProject,
    inviteUserToProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.delete("/:id", protect, deleteProject);
router.post("/:id/invite",protect,inviteUserToProject);


module.exports = router;
