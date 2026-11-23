import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    badgeId: { type: String, required: true, unique: true },
    category: { type: String, default: 'Milestone' },
    description: { type: String, required: true },
    gamesRequired: { type: Number, default: 1 },
    icon: { type: String, default: '🏆' },
    starsRequired: { type: Number, default: 5 },
    title: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'achievements'
  }
);

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
