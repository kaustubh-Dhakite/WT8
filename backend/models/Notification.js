import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['STREAK', 'LEADERBOARD', 'BADGE', 'GENERAL'], default: 'GENERAL' },
    icon: { type: String, default: '🔔' },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
