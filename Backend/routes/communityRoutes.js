const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  
const Mentor = require('../models/Mentor');
const Tag = require('../models/Tag');        
const Review = require('../models/Review');
const CommunityPost = require('../Models/CommunityPost'); 
require("dotenv").config();
const { uploadImageToCloudinary } = require("../config/cloudinary");
const { verifyMentor } = require('../middlewares/authMiddleware');
const router = express.Router();
const Community = require('../models/Community');
const { verifyToken } = require('../middlewares/authMiddleware'); // Assuming you have a token verification middleware

router.get('/:mentorId/check-mentee/:menteeId', verifyToken, async (req, res) => {
  const { mentorId, menteeId } = req.params;

  try {
    // Find the community by mentorId
    const community = await Community.findOne({ mentor_id: mentorId });

    // If the community doesn't exist, return an error
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the menteeId is in the mentees array
    const isMember = community.mentees.includes(menteeId);

    // Send the response indicating membership status
    res.json({ isMember });
  } catch (error) {
    res.status(500).json({ message: 'Error checking community membership', error });
  }
});

// router.post('/createCommunity',verifyMentor,async (req, res) => {
//     const mentorId=req.mentor._id;
//     if(!mentorId){
//         return res.status(400).json({
//             message:"Mentor Not authorised",
//             success:false,
//         })
//     }
//     const mentor=await findMentorById(mentorId);
//     if(!mentor.isCreatedCommunity){
//         try {
//             const community = await community.create
//         } catch (error) {
            
//         }
//     }
// })

router.post('/communityPost', async (req, res) => {
    const { community_id, title, content, timestamp } = req.body;
    const image = req.files?.image; // Assuming image is sent as `image` field
    let imageUrl = '';

    try {
        // Check if an image is provided, then upload to Cloudinary
        if (image) {
            const cloudinaryResponse = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
            imageUrl = cloudinaryResponse.secure_url;
        }

        // Create and save the new community post
        const communityPost = await CommunityPost.create({
            community_id,
            title,
            content,
            imageUrl,
            timestamp,  // Include timestamp
        });

        // Find the community document and push the post ID
        const community = await Community.findById(community_id);
        community.communityPosts.push(communityPost._id);

        // Save the community document to persist the update
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



// Route to check and join a community
router.get('/:mentorId/check-join', verifyToken, async (req, res) => {
    const { mentorId } = req.params;
  const menteeId = req.user.id; // Assume `verifyToken` middleware attaches user info to `req`

  try {
    // Find the community for this mentor
    let community = await Community.findOne({ mentor_id: mentorId });

    if (!community) {
      return res.status(404).json({ message: "Community not found for this mentor", joined: false });
    }
    // Check if mentee is already in the community
    const isMenteeInCommunity = community.mentees.includes(menteeId);

    if (isMenteeInCommunity) {
      return res.status(200).json({ message: "Already in community", joined: true });
    } else {
      // Add mentee to the community
      community.mentees.push(menteeId);
        await community.save();
        console.log("Mentee added to community:", community.mentees);
      return res.status(200).json({ message: "Joined community successfully", joined: true });
    }
  } catch (error) {
    console.error("Error in joining community:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get('/:communityId/posts', async (req, res) => {
    const { communityId } = req.params;
  
      try {
          // Find the community by ID and populate the communityPosts array
          const community = await Community.findById(communityId)
              .populate({
                  path: 'communityPosts',
                  select: 'title content imageUrl likedMentees dislikedMentees' // Only get the required fields from each post
              })
              .select('communityPosts'); // Only include the communityPosts array in the response
  
          if (!community) {
              return res.status(404).json({ error: 'Community not found' });
          }
            const postsWithCounts = community.communityPosts.map(post => ({
              _id: post._id,
              title: post.title,
              content: post.content,
              imageUrl: post.imageUrl,
              likeCount: post.likedMentees.length,
              dislikeCount: post.dislikedMentees.length,
          }));
  
          res.status(200).json({success:true,posts:postsWithCounts,message:"post fetched successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching community posts' });
    }
  });

module.exports = router;
