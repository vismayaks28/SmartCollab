const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

const {
    createRepository,
    getRepositories,
    getRepository,
    updateRepository,
    deleteRepository
} = require("../controllers/repositoryController");

router.post("/", protect, createRepository);
router.get("/", protect, getRepositories);
router.get("/:id", optionalAuth, getRepository);
router.patch("/:id", protect, updateRepository);
router.delete("/:id", protect, deleteRepository);

module.exports = router;