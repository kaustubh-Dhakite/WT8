import express from 'express';
import { getAllAchievements, getMyAchievements } from '../controllers/achievementController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllAchievements);
router.get('/my', optionalProtect, getMyAchievements);

export default router;
