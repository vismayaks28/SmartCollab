const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    createRepository
} = require("../controllers/repositoryController");

router.post("/", protect, createRepository);

module.exports = router;