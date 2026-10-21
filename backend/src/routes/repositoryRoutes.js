const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createRepository,
    getRepositories,
    getRepository
} = require("../controllers/repositoryController");

router.post("/", protect, createRepository);
router.get("/", protect, getRepositories);
router.get("/:id", protect, getRepository);

module.exports = router;