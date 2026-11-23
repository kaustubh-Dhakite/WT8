import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getNotifications);
router.patch('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

export default router;
