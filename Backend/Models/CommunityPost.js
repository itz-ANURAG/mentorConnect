const mongoose = require('mongoose');

// Community Message (posts by mentors in the community section):
// Fields: message_id, content, link, timestamp, mentor_id.

const communityPostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    link: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
