const mongoose = require('mongoose');

// User (for mentors and mentees):
// Fields: user_id, name, email, role (mentor or mentee), profile_details, tags (areas of expertise for mentors or interests for mentees).



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['mentor', 'mentee'], required: true },
    profile_details: { type: String, default: '' },
    tags: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);
