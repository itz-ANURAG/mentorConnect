const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Community = require('../models/Community');
const Mentee = require('../models/Mentee');
const { verifyToken, verifyMentee } = require('../middlewares/authMiddleware'); // Assuming you have a token verification middleware

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
        let mentee =await Mentee.findById(menteeId);
        mentee.communityJoined.push(community._id);
        await mentee.save();
      return res.status(200).json({ message: "Joined community successfully", joined: true });
    }
  } catch (error) {
    console.error("Error in joining community:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to fetch communities joined by the authenticated mentee
router.get('/mentee/communities',verifyMentee, async (req, res) => {
  try {
    const menteeId = req.mentee.id;
    
    // Find the mentee and populate communities joined
    const mentee = await Mentee.findById(menteeId)
      .populate({
        path: 'communityJoined',
        populate: {
          path: 'mentor_id',
          select: 'name profilePicture' // Select specific fields from mentor
        },
      })
      .select('communityJoined');

    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Format the community data to include mentor info and member count
    const communities = mentee.communityJoined.map(community => ({
      communityId: community._id,
      mentorName: community.mentor_id.name, // Mentor's name
      mentorProfilePicture: community.mentor_id.profilePicture, // Mentor's profile picture
      memberCount: community.mentees.length, // Number of mentees in the community
    }));

      res.status(201).json({
          success: true,
          communities,
          mentee,
          message:"Communities Fetched Succesfully"
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch posts for a specific community
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

        // Format posts with like and dislike counts
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
