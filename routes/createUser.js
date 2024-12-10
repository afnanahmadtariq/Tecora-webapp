const express = require('express');
const { createUser } = require('../controllers/createUser');
const router = express.Router();

// Endpoint for receiving query posts
router.post('/', createUser);

module.exports = router;
