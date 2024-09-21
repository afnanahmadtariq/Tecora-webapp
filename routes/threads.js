const express = require('express');
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Thread
router.post('/', auth, async (req, res) => {
  const { title, content, community, media } = req.body;
  const thread = new Thread({ userId: req.user._id, title, content, community, media });
  
  await thread.save();
  res.status(201).send(thread);
});

// Create Reply
router.post('/:threadId/replies', auth, async (req, res) => {
  const { content, media } = req.body;
  const reply = new Reply({ userId: req.user._id, threadId: req.params.threadId, content, media });
  
  await reply.save();
  res.status(201).send(reply);
});

// Get all threads
router.get('/', async (req, res) => {
  const threads = await Thread.find().populate('userId', 'username');
  res.send(threads);
});

// Get replies for a thread
router.get('/:threadId/replies', async (req, res) => {
  const replies = await Reply.find({ threadId: req.params.threadId }).populate('userId', 'username');
  res.send(replies);
});

module.exports = router;
