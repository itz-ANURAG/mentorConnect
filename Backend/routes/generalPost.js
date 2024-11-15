const express = require('express');
const router = express.Router();
const PostModel  = require('../Models/GeneralPost')
const Mentor = require('../models/Mentor');  // Import Mentor model
const Mentee = require('../models/Mentee');  // Import Mentee model
const Comment = require('../models/Comment')
const {uploadImageToCloudinary} = require('../config/cloudinary')
const mongoose = require('mongoose')




router.post('/create',async (req,res)=>{
    const { userId , title, content, timestamp  , role,username} = req.body;
    const image = req.files?.image; // Assuming image is sent as `image` field
    // console.log(role);
    const userModel = role ==='mentee' ? Mentee : Mentor;
    let imageUrl = ''
    try {
        // Check if an image is provided, then upload to Cloudinary
        if (image) {
            const cloudinaryResponse = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
            imageUrl = cloudinaryResponse.secure_url;
        }

        const Post =await PostModel.create({
            user_id:userId,
            content,
            timestamp,
            title,
            username,
            imageUrl
        })
        // console.log("post saved");
        const user = await userModel.findById(userId);
        // console.log("User:",user);
        user.posts.push(Post._id);
        await user.save();
        // console.log("Post done");
        // console.log("PostId:",Post._id);
        res.status(201).json({ 
            success: true,
            message: 'Post created successfully' 
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: 'Failed to create post' });
    }
})


// Handle Like action
router.post('/dislikes', async (req, res) => {
    const { userId, postId, role } = req.body;
    let already = false;
    try {
        const post = await PostModel.findById(postId);

        // Check if post is fetched correctly
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Convert userId to ObjectId if necessary
        const userObjectId = new mongoose.Types.ObjectId(userId);


        // Check if the user already liked the post
        if (post.likes.includes(userObjectId)) {
            // Remove the user from likes
            post.likes = post.likes.filter(id => !id.equals(userObjectId));
            already = true;
        }

        // Check if the user already disliked the post
        if (post.disLikes.includes(userObjectId)) {
            return res.status(201).json({
                success: false,
                message: 'You have already disliked this post',
                already
            });
        }

        // Add the userId to the dislikes array
        post.disLikes.push(userObjectId);
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Post disliked successfully',
            already
        });
    } catch (error) {
        console.error("Error disliking post:", error);
        res.status(500).json({ error: 'Failed to dislike post' });
    }
});




router.post('/likes', async (req, res) => {
    const { userId, postId, role } = req.body;
    let already = false;
    try {
        const post = await PostModel.findById(postId);

        // Check if post is fetched correctly
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        
        // Convert userId to ObjectId if necessary
        const userObjectId = new mongoose.Types.ObjectId(userId);


        // Check if the user already disliked the post
        if (post.disLikes.includes(userObjectId)) {
            // Remove the user from dislikes
            post.disLikes = post.disLikes.filter(id => !id.equals(userObjectId));
            already = true;
        }

        // Check if the user already liked the post
        if (post.likes.includes(userObjectId)) {
            return res.status(201).json({
                success: false,
                message: 'You have already liked this post',
                already
            });
        }

        // Add the userId to the likes array
        post.likes.push(userObjectId);
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Post liked successfully',
            already
        });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});



// Route to handle posting a comment
router.post('/comments', async (req, res) => {
    const { userId, postId, role, comment ,username } = req.body;

    try {
        // Check if the comment is not empty
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        // Create a new comment object
        const newComment = new Comment({
            user_id: userId, // The ID of the user commenting (mentee or mentor)
            post_id: postId, // The post ID where the comment is being posted
            content: comment, // The content of the comment
            timestamp: new Date(), // Timestamp when the comment is created
            username,
        });

        // Save the new comment to the database
        const savedComment = await newComment.save();

        // Update the GeneralPost to add the new comment ID to the comments array
        await PostModel.findByIdAndUpdate(
            postId, // The ID of the post
            { $push: { comments: savedComment._id } }, // Push the new comment ID to the comments array
            { new: true } // Option to return the updated document
        );

        // Respond with the saved comment
        res.status(201).json({
            success: true,
            message: 'Comment posted successfully',
            comment: savedComment,
        });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ success: false, message: 'Failed to post comment' });
    }
});





router.get('/getAllPost', async (req, res) => {
    try {
        // Fetch all posts and populate user references
        const posts = await PostModel.find()
            .populate('user_id', 'username') // Populate user details if needed
            .populate('comments') // Populate comments if necessary
            .exec();

        res.status(200).json({
            success: true,
            posts, // Send all posts in the `posts` attribute
        });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch posts',
        });
    }
});


module.exports = router;