const express = require('express');
const { createUser } = require('../controllers/profile');
const router = express.Router();

// Endpoint for receiving query posts
router.post('/', createUser);

module.exports = router;
