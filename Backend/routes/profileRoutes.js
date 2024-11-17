
const express = require('express');
const Mentor = require('../Models/Mentor');
const Mentee = require('../Models/Mentee');
const Tag = require('../Models/Tag');
const { verifyToken } = require('../middlewares/authMiddleware');
const { uploadImageToCloudinary } = require('../config/cloudinary');
const router = express.Router();

// Route to update the user's profile (either mentor or mentee)
router.put('/update', verifyToken, async (req, res) => {
    const userId = req.user.id;  
    const { role } = req.user; 
    const { firstName, lastName, name, bio, jobTitle, company, location, summary, skills } = req.body;  // Destructure the profile fields to be updated
    
    try {
        // Fetch the user (mentor or mentee) from the database based on the user role
        let user = role === 'mentor' ? await Mentor.findById(userId) : await Mentee.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });  // Return error if user is not found

        // Update basic profile fields based on the role and request body
        if (role === 'mentor' && name) user.name = name; 
        if (role === 'mentee') {
            if (firstName) user.firstName = firstName; 
            if (lastName) user.lastName = lastName; 
        }
        if (bio) user.bio = bio;  // Update bio
        if (jobTitle) user.jobTitle = jobTitle;  
        if (company) user.company = company; 
        if (location) user.location = location; 
        if (summary) user.summary = summary; 

        if (req.files && req.files.profilePicture) {
            const profilePicture = req.files.profilePicture; 
            const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);  // Upload image to Cloudinary
            user.profilePicture = image.secure_url; 
        }

        // Handle skills update (skills come as a comma-separated string)
        if (skills && typeof skills === 'string') {
            const skillNames = skills.split(',').map(skill => skill.trim());
            
            // Update the skills array
            const skillIds = await Promise.all(
                skillNames.map(async (skillName) => {
                    let tag = await Tag.findOne({ name: skillName }); 
                    
                    // Mentors can create new skills if not already in the database
                    if (!tag && role === 'mentor') {
                        tag = await new Tag({ name: skillName });
                    }
                    
                    // Only add the user to the tag if not already associated
                    if (tag && !tag.associated_users.includes(userId)) {
                        tag.associated_users.push(userId); 
                        await tag.save(); 
                    }

                    return tag ? tag._id : null;  // Return tag ID (null if no tag found)
                })
            );
            
            user.skills = skillIds.filter(id => id);  // Filter out null values (invalid tags)
        }

        await user.save();

        // Respond with success message and updated user data
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

// Route to fetch all available skills (tags) from the database
router.get('/getAllSkills', async (req, res) => {
    try {
        const tags = await Tag.find().distinct('name'); 
        console.log(tags);

        // If no skills found in the database, provide default sample skills
        const skillsList = tags.length ? tags : ["JavaScript", "Python", "Data Science", "Machine Learning", "Web Development"];
        
        res.status(200).json({
            success: true,
            message: 'All available skills fetched',
            skills: skillsList  // Return the list of available skills
        });
    } catch (error) {
        console.error('Error retrieving skills:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve skills' });
    }
});

module.exports = router;

