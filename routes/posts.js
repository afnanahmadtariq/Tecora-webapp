const express = require('express');
const { getPost } = require('../controllers/postController');
const router = express.Router();

router.get('/:id', (req, res) => {
    const { id } = req.params;
    getPost(id, req, res);
  });

module.exports = router; 