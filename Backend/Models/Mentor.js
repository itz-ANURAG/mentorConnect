const mongoose = require('mongoose');
const Community = require('./Community');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    bio: { type: String },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    summary: { type: String },
    freeSlots: [{
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        date: { type: Date, required: true },  // Ensure date is stored as Date object
        time: { type: String, required: true }
    }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    upcomingSessions: [{
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      date: { type: Date },
      time: { type: String }
    }],  // field for upcoming sessions the mentor will take
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GeneralPost' }],  // posts by the mentor
  // communityPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost' }],  // community posts created by the mentor
    community:{type:mongoose.Schema.Types.ObjectId,ref:'Community'},
    ratings: { type: Number, default: 0, min: 0, max: 5 },  // ratings out of 5 stars
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    blockedMentees:[{type:mongoose.Schema.Types.ObjectId,ref:'Mentee'}]
  });
  
  
module.exports= mongoose.model('Mentor', mentorSchema);
 