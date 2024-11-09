const mongoose = require('mongoose');

// Community schema
const communitySchema = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true, // assuming the mentor is required for each community
  },
  mentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee', // mentees are also users
  }],
  communityPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost', // references messages in this community
  }],
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
