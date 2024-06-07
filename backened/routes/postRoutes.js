import express from 'express';
import { createPost, likePost, getPosts } from '../controllers/postController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { postRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', authenticateToken, postRateLimiter, createPost);
router.post('/like', authenticateToken, likePost);
router.get('/:id', getPosts);

export default router;
