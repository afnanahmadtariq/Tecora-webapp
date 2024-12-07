const express = require('express');
const { createPost } = require('../controllers/postController');
const router = express.Router();

// Endpoint for receiving query posts
router.post('/', createPost);

module.exports = router;
