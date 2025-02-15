const mongoose = require('mongoose');

// General Post (for users posting in the general page):
// Fields: post_id, user_id, content, timestamp, reactions, comments.

const generalPostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor',ref:'Mentee' , required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor',ref:'Mentee'  }],
    disLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentor',ref:'Mentee' }],
    content: { type: String, required: true },
    username: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    imageUrl:{type:String,default:''},
});

module.exports = mongoose.model('GeneralPost', generalPostSchema);
