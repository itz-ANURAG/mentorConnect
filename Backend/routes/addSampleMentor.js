const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');
const Tag = require('../models/Tag');
const Review = require('../models/Review');
const Mentee = require('../models/Mentee');
const Session = require('../models/Session');

const mongoURI = 'mongodb+srv://anuraggolu123:U3MV4ghuIW9gmOQK@cluster0.my5qu.mongodb.net/';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function addSampleMentor() {
  try {
    // Create sample skills
    const skill1 = await Tag.create({ name: 'JavaScript' });
    const skill2 = await Tag.create({ name: 'React' });
    const skill3 = await Tag.create({ name: 'Node.js' });

    console.log('Skills created:', [skill1, skill2, skill3]);

    // Create a sample mentee
    const mentee = await Mentee.create({
      firstName: 'Abhi',
      lastName: 'Yadav',
      email: 'abhimentee@gmail.com',
      profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDXHyqEEcIEQzggUF5RIBe8g37M9n1guqKhg&s',
      jobTitle:"Software Engineer",
    });

    console.log('Mentee created:', mentee);

    // Create a sample mentor
    const mentor = await Mentor.create({
      name: 'Abhi Yadav',
      email: 'abhimentor@gmail.com',
      password: 'hashed_password_here', // Replace with an actual hashed password
      profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDXHyqEEcIEQzggUF5RIBe8g37M9n1guqKhg&s',
      bio: 'Experienced software engineer with a passion for teaching.',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'New York, USA',
      summary: '10+ years of experience in software development and mentoring.',
      skills: [skill1._id, skill2._id, skill3._id],
      reviews: [] // Initialize review array
    });

    console.log('Mentor created:', mentor);

    // Create a sample session associated with the mentor and mentee
    const session = await Session.create({
      mentor_id: mentor._id,
      mentee_id: mentee._id,
      date: new Date(), // Set to current date
      time: '10:00 AM', // Example time
      status: 'upcoming', // Set session status
      session_type: 'one-on-one' // Type of session
    });

    console.log('Session created:', session);

    // Create sample reviews
    const review1 = await Review.create({
      mentor_id: mentor._id,
      mentee_id: mentee._id,
      session_id: session._id, // Link review to the session
      rating: 5,
      feedback: 'Great mentor, very knowledgeable!'
    });

    console.log('Review 1 created:', review1);

    const review2 = await Review.create({
      mentor_id: mentor._id,
      mentee_id: mentee._id,
      session_id: session._id, // Link review to the session
      rating: 4,
      feedback: 'Very helpful session!'
    });

    console.log('Review 2 created:', review2);

    // Check if reviews exist before pushing
    if (!mentor.reviews) {
      console.log('Mentor reviews array is undefined. Initializing it.');
      mentor.reviews = []; // Initialize if undefined
    }

    mentor.reviews.push(review1._id, review2._id); // Push review IDs into the array

    await mentor.save(); // Save mentor with updated reviews
    console.log('Sample mentor and session added successfully:', mentor);

  } catch (error) {
    console.error('Error adding sample mentor:', error);
  } finally {
    mongoose.connection.close();
  }
}

addSampleMentor();
