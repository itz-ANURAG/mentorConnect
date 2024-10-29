const mongoose = require('mongoose');

// Session (for booked mentor-mentee interactions):
// Fields: session_id, mentor_id, mentee_id, date, time, status (upcoming, completed), session_type (one-on-one, one-to-many).



const sessionSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed'], required :true},
    session_type: { type: String, enum: ['one-on-one', 'one-to-many'], required:true },
});

module.exports = mongoose.model('Session', sessionSchema);
