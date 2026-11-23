import express from 'express';
import { getMyStreak } from '../controllers/streakController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', optionalProtect, getMyStreak);

export default router;
