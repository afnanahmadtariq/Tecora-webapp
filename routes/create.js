const express = require('express');
const router = express.Router();
const { createPost } = require("../controllers/postController");
const { createProject } = require("../controllers/projectController");

router.post('/post', createPost);

router.post('/project', createProject);

module.exports = router;


  