const mongoose = require('mongoose');

// Comment (for general posts only):
// Fields: comment_id, post_id, user_id, content, timestamp.


const commentSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneralPost', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
