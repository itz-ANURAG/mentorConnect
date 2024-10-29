const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String,required: true },
    bio: { type: String },
    jobTitle: { type: String ,required: true},  // field for job title
    company: { type: String,required: true },   // field for company
    location: { type: String,required: true },  // field for location
    summary: { type: String,required: true },
    freeSlots: [{ 
      date: { type: Date },
      time: { type: String }
    }],  // field for available free 1-on-1 session slots
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],  // skills referencing the Tag model
    upcomingSessions: [{
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      date: { type: Date },
      time: { type: String }
    }],  // field for upcoming sessions the mentor will take
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],  // posts by the mentor
    communityPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost' }],  // community posts created by the mentor
    ratings: { type: Number, default: 0, min: 0, max: 5 },  // ratings out of 5 stars
  });
  
  const Mentor = mongoose.model('Mentor', mentorSchema);
  module.exports= Mentor;