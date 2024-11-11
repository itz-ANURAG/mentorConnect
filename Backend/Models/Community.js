const mongoose = require('mongoose');

// Community schema
const communitySchema = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  mentees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentee',
  }],
  communityPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
  }],
}, { timestamps: true });

module.exports = mongoose.models.Community || mongoose.model('Community', communitySchema);
