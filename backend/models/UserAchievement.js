import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    badgeId: { type: String, required: true },
    icon: { type: String, default: '🏅' },
    title: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    userEmail: { type: String, default: '' },
    userName: { type: String, default: '' }
  },
  {
    timestamps: true,
    collection: 'user_achievements'
  }
);

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
export default UserAchievement;
