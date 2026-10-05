const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createRepository,
    getRepositories
} = require("../controllers/repositoryController");

router.post("/", protect, createRepository);
router.get("/", protect, getRepositories);

module.exports = router;