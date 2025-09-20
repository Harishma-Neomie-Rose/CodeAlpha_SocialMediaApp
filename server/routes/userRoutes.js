const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log('✅ User created:', user.username);
    res.json(user);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username bio followers following');
    console.log(`📋 Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Follow/Unfollow a user
router.post('/:id/follow', async (req, res) => {
  const { userId } = req.body; // the user who wants to follow/unfollow
  const targetUserId = req.params.id; // the user to be followed
  
  try {
    console.log('👥 Follow request:', { userId, targetUserId });
    
    if (userId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize arrays if they don't exist
    if (!user.following) user.following = [];
    if (!targetUser.followers) targetUser.followers = [];
    
    // Check if already following
    const isFollowing = user.following.some(id => id.toString() === targetUserId);
    
    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);
      console.log('👥 User unfollowed');
    } else {
      // Follow
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
      console.log('👥 User followed');
    }
    
    await user.save();
    await targetUser.save();
    
    console.log('✅ Follow operation successful');
    res.json({ 
      user: targetUser, // Return the target user with updated followers
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
    
  } catch (err) {
    console.error('❌ Error in follow endpoint:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;