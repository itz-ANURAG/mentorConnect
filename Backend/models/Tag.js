const mongoose = require('mongoose');

// Tag (for assessing mentor-mentee compatibility):
// Fields: tag_id, name, associated_users (either mentors or mentees).

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    associated_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Tag', tagSchema);
