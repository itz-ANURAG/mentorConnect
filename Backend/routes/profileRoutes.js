// const express = require('express'); 
// const Mentor = require('../models/Mentor');
// const Mentee = require('../models/Mentee');
// const Tag = require('../models/Tag');
// const { verifyToken } = require('../middlewares/authMiddleware');
// const { uploadImageToCloudinary } = require('../config/cloudinary');
// const router = express.Router();
// require("dotenv").config();

// // PUT request to update mentor or mentee profile
// router.put('/update', verifyToken, async (req, res) => {
//     const userId = req.user.id; 
//     const { role } = req.user;
//     const { firstName, lastName, name, bio, jobTitle, company, location, summary, skills } = req.body;

//     try {
//         let user = role === 'mentor' ? await Mentor.findById(userId) : await Mentee.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         if (role === 'mentor' && name) user.name = name;
//         if (role === 'mentee') {
//             if (firstName) user.firstName = firstName;
//             if (lastName) user.lastName = lastName;
//         }
//         if (bio) user.bio = bio;
//         if (jobTitle) user.jobTitle = jobTitle;
//         if (company) user.company = company;
//         if (location) user.location = location;
//         if (summary) user.summary = summary;

//         if (req.files && req.files.profilePicture) {
//             const profilePicture = req.files.profilePicture;
//             const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);
//             user.profilePicture = image.secure_url;
//         }

//         if (skills && Array.isArray(skills)) {
//             const skillIds = await Promise.all(
//                 skills.map(async (skillName) => {
//                     let tag = await Tag.findOne({ name: skillName });
//                     if (!tag && role === 'mentor') {
//                         tag = new Tag({ name: skillName});
//                     } 
//                     if (tag && !tag.associated_users.includes(userId)) {
//                         tag.associated_users.push(userId);
//                         await tag.save();
//                     }
                    
//                     return tag ? tag._id : null;
//                 })
//             );
//             user.skills = skillIds.filter(id => id);
//             console.log("Updated Skills IDs:", user.skills); // Check if IDs are as expected

//         }

//         await user.save();
//         console.log(user);
//         res.status(200).json({
//             success: true,
//             message: `${role === 'mentee' ? 'Mentee' : 'Mentor'} profile updated successfully`,
//             user
//         });
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         res.status(500).json({
//             success: false,
//             message: `Error updating ${role === 'mentee' ? 'mentee' : 'mentor'} profile`
//         });
//     }
// });

// GET all unique skills

// module.exports = router;
const express = require('express');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Tag = require('../models/Tag');
const { verifyToken } = require('../middlewares/authMiddleware');
const { uploadImageToCloudinary } = require('../config/cloudinary');
const router = express.Router();

// PUT request to update mentor or mentee profile
router.put('/update', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { role } = req.user;
    const { firstName, lastName, name, bio, jobTitle, company, location, summary, skills } = req.body;
    
    try {
        // Fetch the user by role
        let user = role === 'mentor' ? await Mentor.findById(userId) : await Mentee.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update basic profile fields
        if (role === 'mentor' && name) user.name = name;
        if (role === 'mentee') {
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
        }
        if (bio) user.bio = bio;
        if (jobTitle) user.jobTitle = jobTitle;
        if (company) user.company = company;
        if (location) user.location = location;
        if (summary) user.summary = summary;

        // Handle profile picture upload if present
        if (req.files && req.files.profilePicture) {
            const profilePicture = req.files.profilePicture;
            const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);
            user.profilePicture = image.secure_url;
        }

        // Handle skills array update (sent as comma-separated string)
        if (skills && typeof skills === 'string') {
            const skillNames = skills.split(',').map(skill => skill.trim()); // Split skills string into array
            
            const skillIds = await Promise.all(
                skillNames.map(async (skillName) => {
                    let tag = await Tag.findOne({ name: skillName });
                    
                    // Only mentors can create new skills
                    if (!tag && role === 'mentor') {
                        tag = await new Tag({ name: skillName });
                    }
                    
                    if (tag && !tag.associated_users.includes(userId)) {
                        tag.associated_users.push(userId);
                        await tag.save();
                    }

                    return tag ? tag._id : null;
                })
            );
            
            // Update the skills field with valid tag IDs
            user.skills = skillIds.filter(id => id); 
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: `${role === 'mentee' ? 'Mentee' : 'Mentor'} profile updated successfully`,
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: `Error updating ${role === 'mentee' ? 'mentee' : 'mentor'} profile`
        });
    }
});
router.get('/getAllSkills', async (req, res) => {
    try {
        const tags = await Tag.find().distinct('name');
        console.log(tags);
        // Provide default sample skills if no tags found in DB
        const skillsList = tags.length ? tags : ["JavaScript", "Python", "Data Science", "Machine Learning", "Web Development"];
        
        res.status(200).json({
            success: true,
            message: 'All available skills fetched',
            skills: skillsList
        });
    } catch (error) {
        console.error('Error retrieving skills:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve skills' });
    }
});

module.exports = router;

