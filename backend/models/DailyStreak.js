import mongoose from 'mongoose';

const dailyStreakSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: 'Little Explorer' },
    bonusStarsEarned: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
    longestStreak: { type: Number, default: 1 }
  },
  {
    timestamps: true,
    collection: 'daily_streaks'
  }
);

const DailyStreak = mongoose.model('DailyStreak', dailyStreakSchema);
export default DailyStreak;
