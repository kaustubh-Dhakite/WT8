import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';

// @desc   Get all available achievements
// @route  GET /api/achievements
// @access Public
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ starsRequired: 1 });
    res.json({ success: true, count: achievements.length, achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get earned achievements for user
// @route  GET /api/achievements/my
// @access Private / Public with email query
export const getMyAchievements = async (req, res) => {
  try {
    const email = req.user ? req.user.email : req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    const badges = await UserAchievement.find({ userEmail: email }).sort({ unlockedAt: -1 });
    res.json({ success: true, count: badges.length, badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
