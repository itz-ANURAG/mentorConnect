const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  
const Tag = require('../models/Tag');        
const Review = require('../models/Review');
const router = express.Router();
const CommunityPost = require('../Models/CommunityPost'); 
require("dotenv").config();
const { uploadImageToCloudinary } = require("../config/cloudinary");
const { verifyMentor } = require('../middlewares/authMiddleware');

router.get('/joinedCommunities', async (req, res) => {
    
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
    const { mentor_id,title, content, timestamp } = req.body;
    const image = req.files?.image; // Assuming image is sent as `image` field
    let imageUrl = '';
    

    try {
        // Check if an image is provided, then upload to Cloudinary
        if (image) {
            cloudinaryResponse = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
            imageurl =cloudinaryResponse.secure_url;
        }

        // Create and save the new community post
        const communityPost = new CommunityPost({
            mentor_id,
            title,
            content,
            imageurl,
            timestamp,  // Include timestamp
        });
        await communityPost.save();

        res.status(201).json({ 
            success: true,
            message: 'Post created successfully' });
       
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

module.exports = router;