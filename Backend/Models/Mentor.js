const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    bio: { type: String },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    summary: { type: String, required: true },
    freeSlots: [{
        _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        date: { type: Date, required: true },  // Ensure date is stored as Date object
        time: { type: String, required: true }
    }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    upcomingSessions: [{
<<<<<<< HEAD
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
=======
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
        date: { type: Date },
        time: { type: String }
    }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    communityPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost' }],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

const Mentor = mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);
module.exports = Mentor;
>>>>>>> 423129e1af1fe8838c5204b9eb73f5572b960fc1
