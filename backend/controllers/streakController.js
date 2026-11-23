import DailyStreak from '../models/DailyStreak.js';

// @desc   Get user daily streak
// @route  GET /api/streaks/my
// @access Private / Public with email query
export const getMyStreak = async (req, res) => {
  try {
    const email = req.user ? req.user.email : req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    const streak = await DailyStreak.findOne({ userEmail: email });
    if (!streak) {
      return res.json({
        success: true,
        streak: {
          currentStreak: 1,
          longestStreak: 1,
          bonusStarsEarned: 0
        }
      });
    }
    res.json({ success: true, streak });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
