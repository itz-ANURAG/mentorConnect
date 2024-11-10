const mongoose = require('mongoose');

// Community Message (posts by mentors in the community section):
// Fields: message_id, content, link, timestamp, mentor_id.

const communityPostSchema = new mongoose.Schema({
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageurl: { type: String,default :''},
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('communityPosts', communityPostSchema);
