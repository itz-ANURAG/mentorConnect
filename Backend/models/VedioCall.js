const mongoose = require('mongoose');

// Video Call (for one-on-one and one-to-many sessions):
// Fields: call_id, participants, start_time, end_time, session_id.

const videoCallSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
});

module.exports = mongoose.model('VideoCall', videoCallSchema);
