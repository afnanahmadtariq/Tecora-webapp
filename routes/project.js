const express = require('express');
const router = express.Router();
const { createProject, feedProjects, getUserProjects } = require("../controllers/projectController");

// GET /api/projects/user/:userId
router.get('/user/:userId', getUserProjects);

// GET /api/projects
router.get('/', feedProjects);

router.post('/create', createProject);

module.exports = router;