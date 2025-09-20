const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();

    // Create 10 sample users
    const users = await User.insertMany([
      { username: 'Alice', bio: 'Love coding 💻' },
      { username: 'Bob', bio: 'Coffee lover ☕' },
      { username: 'Charlie', bio: 'Music enthusiast 🎵' },
      { username: 'Diana', bio: 'Traveler 🌍' },
      { username: 'Eve', bio: 'Fitness freak 💪' },
      { username: 'Frank', bio: 'Foodie 🍕' },
      { username: 'Grace', bio: 'Bookworm 📚' },
      { username: 'Hannah', bio: 'Nature lover 🌿' },
      { username: 'Ian', bio: 'Dreamer ✨' },
      { username: 'Jack', bio: 'Photographer 📸' }
    ]);

    const [alice, bob, charlie, diana, eve, frank, grace, hannah, ian, jack] = users;

    // Set up some follow relationships
    alice.following.push(bob._id, charlie._id);
    bob.followers.push(alice._id);

    charlie.following.push(diana._id);
    diana.followers.push(charlie._id);

    eve.following.push(alice._id, frank._id);
    alice.followers.push(eve._id);
    frank.followers.push(eve._id);

    grace.following.push(hannah._id, ian._id);
    hannah.followers.push(grace._id);
    ian.followers.push(grace._id);

    jack.following.push(alice._id, diana._id);
    alice.followers.push(jack._id);
    diana.followers.push(jack._id);

    await Promise.all(users.map(u => u.save()));

    // Create 10 sample posts
    const posts = await Post.insertMany([
      {
        author: alice._id,
        content: 'Just finished a new coding project! 💻',
        likes: [bob._id, charlie._id],
        comments: [
          { user: bob._id, text: 'Amazing work, Alice!' },
          { user: charlie._id, text: 'Keep it up!' }
        ]
      },
      {
        author: bob._id,
        content: 'Morning coffee vibes ☕',
        likes: [alice._id, eve._id],
        comments: [
          { user: alice._id, text: 'Looks great!' }
        ]
      },
      {
        author: charlie._id,
        content: 'Listening to my favorite tracks today 🎵',
        likes: [alice._id, bob._id],
        comments: [
          { user: diana._id, text: 'Nice playlist!' }
        ]
      },
      {
        author: diana._id,
        content: 'Exploring the mountains 🌄',
        likes: [charlie._id, jack._id],
        comments: [
          { user: charlie._id, text: 'Beautiful view!' }
        ]
      },
      {
        author: eve._id,
        content: 'Workout done! Feeling great 💪',
        likes: [frank._id],
        comments: [
          { user: frank._id, text: 'Inspiring!' }
        ]
      },
      {
        author: frank._id,
        content: 'Tried a new pizza recipe 🍕',
        likes: [eve._id, alice._id],
        comments: [
          { user: alice._id, text: 'Yummy!' }
        ]
      },
      {
        author: grace._id,
        content: 'Just finished reading a great book 📚',
        likes: [hannah._id],
        comments: [
          { user: hannah._id, text: 'Which book?' }
        ]
      },
      {
        author: hannah._id,
        content: 'Nature walk in the park 🌿',
        likes: [grace._id],
        comments: [
          { user: grace._id, text: 'So refreshing!' }
        ]
      },
      {
        author: ian._id,
        content: 'Dreaming of future adventures ✨',
        likes: [grace._id, diana._id],
        comments: [
          { user: diana._id, text: 'Exciting times ahead!' }
        ]
      },
      {
        author: jack._id,
        content: 'Captured a stunning sunset today 📸',
        likes: [alice._id, diana._id],
        comments: [
          { user: alice._id, text: 'Wow, amazing shot!' }
        ]
      }
    ]);

    console.log('Database seeded successfully with 10 users and 10 posts!');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

seed();
