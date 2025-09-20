const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    
    // Populate the post with author info before returning
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('comments.user', 'username');
    
    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/Unlike a post - THIS WAS MISSING!
router.post('/:id/like', async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;
  
  try {
    console.log('👍 Like request:', { postId, userId });
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Initialize likes array if it doesn't exist
    if (!post.likes) {
      post.likes = [];
    }
    
    // Check if user already liked the post
    const userIndex = post.likes.findIndex(id => id.toString() === userId);
    
    if (userIndex > -1) {
      // User already liked, so unlike (remove from array)
      post.likes.splice(userIndex, 1);
      console.log('👎 Post unliked by user');
    } else {
      // User hasn't liked, so like (add to array)
      post.likes.push(userId);
      console.log('👍 Post liked by user');
    }
    
    await post.save();
    
    // Return the updated post with populated data
    const updatedPost = await Post.findById(postId)
      .populate('author', 'username')
      .populate('comments.user', 'username');
    
    console.log('✅ Like operation successful');
    res.json(updatedPost);
    
  } catch (err) {
    console.error('❌ Error in like endpoint:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add Comment to a Post
router.post('/:id/comments', async (req, res) => {
  const { userId, text } = req.body;
  
  try {
    console.log('💬 Adding comment:', { postId: req.params.id, userId, text });
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Initialize comments array if it doesn't exist
    if (!post.comments) {
      post.comments = [];
    }
    
    post.comments.push({ user: userId, text });
    await post.save();
    
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');
    
    console.log('✅ Comment added successfully');
    res.json(updatedPost);
    
  } catch (err) {
    console.error('❌ Error adding comment:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;