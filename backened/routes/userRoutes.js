import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);

export default router;
