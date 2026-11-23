import express from 'express';
import { getFeedback, submitFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFeedback);
router.post('/', optionalProtect, submitFeedback);
router.delete('/:id', deleteFeedback);

export default router;
