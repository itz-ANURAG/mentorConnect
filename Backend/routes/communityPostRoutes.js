const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { verifyMentee } = require('../middlewares/authMiddleware');

// POST route to like a post
router.post('/:postId/like', verifyMentee, async (req, res) => {
  // const { postId } = req.params;
  console.log(req.params);
  const postId = req.params.postId;
  const menteeId = req.mentee.id;
  console.log(postId);
  try {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add user to likedMentees if not already present
    if (!post.likedMentees.includes(menteeId)) {
      post.likedMentees.push(menteeId);
      // Remove user from dislikedMentees if they had disliked it
      post.dislikedMentees = post.dislikedMentees.filter(id => !id.equals(menteeId));
      await post.save();
    }

    res.status(200).json({ message: 'Post liked', likeCount: post.likedMentees.length, dislikeCount: post.dislikedMentees.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
});

// POST route to dislike a post
router.post('/:postId/dislike',verifyMentee, async (req, res) => {
  const { postId } = req.params;
  const menteeId = req.mentee.id;

  try {
    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add user to dislikedMentees if not already present
    if (!post.dislikedMentees.includes(menteeId)) {
      post.dislikedMentees.push(menteeId);
      // Remove user from likedMentees if they had liked it
      post.likedMentees = post.likedMentees.filter(id => !id.equals(menteeId));
      await post.save();
    }

    res.status(200).json({ message: 'Post disliked', likeCount: post.likedMentees.length, dislikeCount: post.dislikedMentees.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while disliking the post' });
  }
});

module.exports = router;
