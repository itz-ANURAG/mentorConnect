const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../Models/Mentee');  
const Mentor = require('../Models/Mentor'); 
const Tag = require('../Models/Tag');  
const jwt = require('jsonwebtoken');     
const Review = require('../Models/Review'); 
const CommunityPost = require('../Models/CommunityPost');
require("dotenv").config();        
const { uploadImageToCloudinary } = require("../config/cloudinary"); 
const { verifyMentor } = require('../middlewares/authMiddleware');  
const router = express.Router();          
const Community = require('../Models/Community'); 
const mailSender = require('../utils/mailSender'); 
const { verifyToken, verifyMentee } = require('../middlewares/authMiddleware'); 
const FRONTEND_URL=process.env.FRONTEND_URL
// Route to check if a mentee belongs to a community for a given mentor
router.get('/:mentorId/check-mentee/:menteeId', verifyToken, async (req, res) => {
  const { mentorId, menteeId } = req.params;

  try {
    const community = await Community.findOne({ mentor_id: mentorId });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the mentee is a member of the community
    const isMember = community.mentees.includes(menteeId);

    // Send the membership status in the response
    res.json({ isMember });
  } catch (error) {
    res.status(500).json({ message: 'Error checking community membership', error });
  }
});


// Route to create a new post in a community
router.post('/communityPost', async (req, res) => {
    const { community_id, title, content, timestamp } = req.body;
    const image = req.files?.image; // Check if an image is provided
    let imageUrl = '';

    try {
        // Upload the image to Cloudinary if provided
        if (image) {
            const cloudinaryResponse = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
            imageUrl = cloudinaryResponse.secure_url;
        }

        // Create a new community post
        const communityPost = await CommunityPost.create({
            community_id,
            title,
            content,
            imageUrl,
            timestamp,  // Store the timestamp
        });

        // Find the community and update its posts array
        const community = await Community.findById(community_id);
        community.communityPosts.push(communityPost._id);

        // Save the updated community document
        await community.save();

        res.status(201).json({ 
            success: true,
            message: 'Post created successfully' 
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Route to create a new room/session by a mentor
router.post('/roomCreate', async (req, res) => {
  const { email, userId } = req.body;
  const mentorData = await Mentor.findById(userId);
  if (!mentorData) {
    return res.status(201).json({
      success: false,
      msg: "Please login as mentor to create session"
    });
  }
  const token = jwt.sign({ mentorId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const modifyToken = token.replace(/\./g, '*'); // Replace dots for URL compatibility
  const url = `${FRONTEND_URL}/channel/${modifyToken}?role=Mentor&id=${encodeURIComponent(userId)}`;
  const urlm = `${FRONTEND_URL}/channel/${modifyToken}?role=Mentee&id=${encodeURIComponent(userId)}`;

  // Send session confirmation email with URLs
  mailSender(
    email,
    'MentorConnect Meeting session Confirmation',
    `<p>Hello,</p>
    <p>Your mentorship session is confirmed!</p>
    <p><strong>Meeting Details For Mentor Only :</strong></p>
    <p>Join the meeting at your scheduled time:</p>
    <a href="${url}">Join Meeting</a>
    <p>Share this url to your Community</p>
    <a href="${urlm}">Link for Community</a>
    <p>Best Regards,<br>MentorConnect Team</p>`
  ).then(() => console.log('Email sent to mentee.'))
   .catch(err => console.error('Error sending email to mentee:', err));

  res.status(201).json({
    success: true,
    msg: "Session created successfully"
  });
});

// Route to check and join a community
router.get('/:mentorId/check-join', verifyToken, async (req, res) => {
    const { mentorId } = req.params;
    const menteeId = req.user.id; // Extract mentee ID from the request

    try {
        // Find the community associated with the mentor
        let community = await Community.findOne({ mentor_id: mentorId });

        if (!community) {
            return res.status(404).json({ message: "Community not found for this mentor", joined: false });
        }

        // Check if the mentee is already a member
        const isMenteeInCommunity = community.mentees.includes(menteeId);

        if (isMenteeInCommunity) {
            return res.status(200).json({ message: "Already in community", joined: true });
        } else {
            // Add the mentee to the community
            community.mentees.push(menteeId);
            await community.save();
            console.log("Mentee added to community:", community.mentees);

            let mentee = await Mentee.findById(menteeId);
            mentee.communityJoined.push(community._id);
            await mentee.save();

            return res.status(200).json({ message: "Joined community successfully", joined: true });
        }
    } catch (error) {
        console.error("Error in joining community:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to fetch communities joined by a mentee
router.get('/mentee/communities', verifyMentee, async (req, res) => {
  try {
    const menteeId = req.mentee.id;

    // Fetch communities joined by the mentee
    const mentee = await Mentee.findById(menteeId)
      .populate({
        path: 'communityJoined',
        populate: {
          path: 'mentor_id',
          select: 'name profilePicture' // Only include specific fields
        },
      })
      .select('communityJoined');

    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Format community data for response
    const communities = mentee.communityJoined.map(community => ({
        communityId: community._id,
        name: `${community.mentor_id.name}'s Community`,
        mentorName: community.mentor_id.name,
        mentorProfilePicture: community.mentor_id.profilePicture,
        memberCount: community.mentees.length,
    }));

    res.status(201).json({
        success: true,
        communities,
        mentee,
        message: "Communities Fetched Successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch posts for a specific community
router.get('/:communityId/posts', async (req, res) => {
  const { communityId } = req.params;

  try {
      // Fetch the community and populate its posts
      const community = await Community.findById(communityId)
          .populate({
              path: 'communityPosts',
              select: 'title content imageUrl likedMentees dislikedMentees'
          })
          .select('communityPosts');

      if (!community) {
          return res.status(404).json({ error: 'Community not found' });
      }

      // Format posts with like and dislike counts
      const postsWithCounts = community.communityPosts.map(post => ({
          _id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          likeCount: post.likedMentees.length,
          dislikeCount: post.dislikedMentees.length,
      }));

      res.status(200).json({ success: true, posts: postsWithCounts, message: "Posts fetched successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching community posts' });
  }
});

module.exports = router;
