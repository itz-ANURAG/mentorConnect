const mongoose = require('mongoose');

// Reaction (for messages in the community section):
// Fields: reaction_id, user_id, message_id, reaction_type, timestamp.

const reactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityMessage', required: true },
    reaction_type: { type: String, required: true }, // e.g., 'like'
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reaction', reactionSchema);
