import express from 'express';
import {
  saveGameRecord,
  getMyHistory,
  getAllRecords
} from '../controllers/gameRecordController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalProtect, saveGameRecord);
router.get('/my-history', optionalProtect, getMyHistory);
router.get('/', getAllRecords);

export default router;
