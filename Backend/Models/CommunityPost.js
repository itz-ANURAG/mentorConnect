const mongoose = require('mongoose');

// Community Message (posts by mentors in the community section):
// Fields: message_id, content, link, timestamp, mentor_id.

const communityPostSchema = new mongoose.Schema({
    title: { type:String, required: true },
    content: {type: String, required: true },
    imageUrl:{type:String,default:''},
    timestamp: { type: Date, default: Date.now },
    community_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    likedMentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee'}],
    dislikedMentees:[{type:mongoose.Schema.Types.ObjectId,ref:'Mentee'}],
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
