const mongoose = require('mongoose');

// Chat (for messages in one-on-one video calls and community):
// Fields: chat_id, session_id, sender_id, message, timestamp.


const chatSchema = new mongoose.Schema({
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
