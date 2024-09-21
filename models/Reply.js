const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  content: { type: String, required: true },
  media: { type: String }, // URL or path to media
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reply', replySchema);
