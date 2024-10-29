const mongoose = require('mongoose');

// star based rating system
// Rating/Feedback (for feedback after sessions):
// Fields: rating_id, mentor_id, mentee_id, session_id, rating (numerical score), feedback (optional text), date.

const reviewSchema = new mongoose.Schema({
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    mentee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentee', required: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 stars
    feedback: { type: String, default: '' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
