import express from 'express';
import { getGameStats, getPlatformOverview } from '../controllers/statController.js';

const router = express.Router();

router.get('/', getGameStats);
router.get('/overview', getPlatformOverview);

export default router;
