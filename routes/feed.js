const express = require('express');
const router = express.Router();
const { feedPosts } = require("../controllers/postController");

router.get('/posts', feedPosts);

router.get('/projects', async (req, res) => {

});

router.get('/experts', async (req, res) => {

});

router.get('/projects', async (req, res) => {

});

module.exports = router;


  