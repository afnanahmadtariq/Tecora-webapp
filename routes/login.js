const express = require('express');
const { loginUser } = require('../controllers/loginUser');
const router = express.Router();

// Endpoint for receiving query posts
router.post('/', loginUser);

module.exports = router;
