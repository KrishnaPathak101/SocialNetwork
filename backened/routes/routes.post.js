import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Create a new post
router.post('/post', async (req, res) => {
  const { user, text } = req.body;
  if( !user || !text) {
    return res.status(400).json({ status: 'error', message: 'User and text are required' });
  }
  try {
    const newPost = new Post({
      user,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json({ status: 'success', data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Error creating post' });
  }
});

export default router;
