const express = require('express');
const { updateUser } = require('../controllers/updateUser');
const router = express.Router();

// Endpoint for receiving query posts
router.post('/', updateUser);

module.exports = router;
