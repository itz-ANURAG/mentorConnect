const mongoose = require('mongoose');

// Community Message (posts by mentors in the community section):
// Fields: message_id, content, link, timestamp, mentor_id.

const communityMessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    link: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);
