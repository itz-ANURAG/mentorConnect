const express = require('express');
const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');  // Import Mentor model
const Tag = require('../models/Tag');      // Import Tag model
const Review = require('../models/Review');
const router = express.Router();


// // Route to handle mentor search with filters
router.get('/search', async (req, res) => {
  try {
    const { searchQuery, skills, jobTitle, company, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Skill filtering: Convert skill names to ObjectIds
    if (skills) {
      const skillNames = skills.split(',');
      const skillTags = await Tag.find({ name: { $in: skillNames } });  // Find skill tags by name
      const skillIds = skillTags.map(tag => tag._id);  // Extract ObjectIds

      // Add skill filter using ObjectIds
      filter.skills = { $in: skillIds };
    }

    // Add jobTitle and company filters if provided
    if (jobTitle) {
      filter.jobTitle = { $in: jobTitle.split(',') };
    }
    if (company) {
      filter.company = { $in: company.split(',') };
    }

    // Search query for name, jobTitle, and company fields
    if (searchQuery) {
      filter.$or = [
        { name: new RegExp(searchQuery, 'i') },
        { jobTitle: new RegExp(searchQuery, 'i') },
        { company: new RegExp(searchQuery, 'i') },
      ];
    }

    // Pagination setup
    const mentors = await Mentor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('skills', 'name');  // Populate skills field with skill name

    const totalMentors = await Mentor.countDocuments(filter);
    const totalPages = Math.ceil(totalMentors / limit);

    res.status(200).json({
      mentors,
      pagination: {
        currentPage: page,
        totalPages,
        totalMentors,
      },
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:id', async (req, res) => {
    const mentorId = req.params.id;

    try {
        const mentor = await Mentor.findById(mentorId)
            .populate('skills', 'name') // Populate only the name field of skills
            .populate({
                path: 'reviews', // Populate review field
                select: 'feedback rating mentee_id', // Include feedback, rating, and mentee_id
                populate: {
                    path: 'mentee_id', // Mentee reference
                    select: 'firstName lastName profilePicture', // Select firstName, lastName, and profilePic
                },
                options: { sort: { date: -1 } }, // Sort reviews by date (latest first)
            });

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found',
            });
        }

        // Extract skills as an array of names
        const skillsArray = mentor.skills ? mentor.skills.map(skill => skill.name) : [];

        // Map reviews to the desired testimonial format
        const reviewsArray = mentor.reviews
            ? mentor.reviews.map(review => ({
                id: review._id, 
                name: `${review.mentee_id?.firstName || 'Anonymous'} ${review.mentee_id?.lastName || ''}`.trim(), 
                role:review.mentee_id.jobTitle || 'Mentee JobTitle', // Fixed role as 'Mentee'
                description: review.feedback,
                rating: review.rating,
                profilePicture: review.mentee_id?.profilePicture || 'http://localhost:3000/images/abhishek.png', // Fetch mentee's profile picture or use a default
            }))
            : [];
            console.log(mentor);

        res.status(200).json({
            success: true,
            message: 'Mentor details and reviews retrieved successfully',
            mentor: {
                    name: mentor.name,
                    email: mentor.email,
                    jobTitle: mentor.jobTitle,
                    profilePicture: mentor.profilePicture,
                    company: mentor.company,
                    location: mentor.location,
                    bio: mentor.bio,
                    summary: mentor.summary,
                    ratings: mentor.ratings, // will be avg of ratings of sessions took by a particular mentor
                    skills: skillsArray, // Array of skill names
                    reviews: reviewsArray, // Array of formatted reviews
                    reviews_cnt:mentor.reviews.length,
                },
        });
    } catch (error) {
        console.error("Error retrieving mentor details:", error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while retrieving mentor details',
        });
    }
});
//Route to get normalfree slots for a specific mentor
router.get('/:id/normalfree-slots', async (req, res) => {
  try {
      const mentor = await Mentor.findById(req.params.id).select('freeSlots');
      if (!mentor) return res.status(404).json({ 
        success:false,
        message: 'Mentor not found',
      });
      res.status(201).json({
        success:true,
        data:mentor.freeSlots,
      });
  } catch (error) {
      res.status(500).json({ 
        success:false,
        message: 'Server error' });
  }
});

router.post('/:mentorId/reviews', async (req, res) => {
  const { rating, feedback, mentee_id, session_id } = req.body;
  const mentorId = req.params.mentorId;

  if (!rating || !feedback || !mentee_id || !session_id) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  try {
    // Create the review
    const newReview = new Review({
      mentor_id: mentorId,
      mentee_id,
      session_id,
      rating,
      feedback,
    });
    await newReview.save();

    // Update the mentor's reviews array
    await Mentor.findByIdAndUpdate(
      mentorId,
      { $push: { reviews: newReview._id } }, // Add the review ID to the reviews array
      { new: true }
    );

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});



module.exports = router;