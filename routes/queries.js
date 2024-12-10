const express = require('express');
const { queries } = require('../controllers/myQueries');
const router = express.Router();

// Endpoint for receiving query posts
router.get('/', queries);

module.exports = router;
