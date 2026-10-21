const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

const {
    createRepository,
    getRepositories,
    getRepository,
    updateRepository,
    deleteRepository,
    updateReadme,
    getRepositoryFiles,
    createRepositoryFile

} = require("../controllers/repositoryController");

router.post("/", protect, createRepository);
router.get("/", protect, getRepositories);
router.get("/:id", optionalAuth, getRepository);
router.patch("/:id", protect, updateRepository);
router.delete("/:id", protect, deleteRepository);
router.patch("/:id/readme", protect, updateReadme);

router.get("/:id/files", optionalAuth, getRepositoryFiles);
router.post("/:id/files", protect, createRepositoryFile);

module.exports = router;