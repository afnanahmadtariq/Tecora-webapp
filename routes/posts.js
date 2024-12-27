const express = require('express');
const { getPost, getMyPost, createPost, getReplies, reply } = require('../controllers/postController');
const authJWT = require('../middleware/authJWT');
const router = express.Router();

router.get('/getpost/:id', (req, res) => {
  const { id } = req.params;
  getPost(id, req, res);
});

router.get('/myposts', async (req, res) => {
  authJWT(req, res, getMyPost);
});

router.post('/create', async (req, res) => {
  authJWT(req, res, createPost);
});

router.get('/getreplies', async (req, res) => {
  authJWT(req, res,  getReplies);
});

router.post('/reply', async (req, res) => {
  authJWT(req, res, reply);
});

module.exports = router; 