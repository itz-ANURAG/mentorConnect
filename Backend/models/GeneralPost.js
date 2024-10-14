const mongoose = require('mongoose');

// General Post (for users posting in the general page):
// Fields: post_id, user_id, content, timestamp, reactions, comments.

const generalPostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('GeneralPost', generalPostSchema);
