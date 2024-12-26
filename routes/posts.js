const express = require('express');
const { getPost, getMyPost } = require('../controllers/postController');
const authJWT = require('../middleware/authJWT');
const router = express.Router();

router.get('/getpost/:id', (req, res) => {
  const { id } = req.params;
  getPost(id, req, res);
});

router.get('/myposts', async (req, res) => {
  authJWT(req, res, getMyPost);
});

module.exports = router; 