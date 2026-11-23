import User from '../models/User.js';
import DailyStreak from '../models/DailyStreak.js';
import UserAchievement from '../models/UserAchievement.js';
import Ranking from '../models/Ranking.js';

// @desc   Get user profile with stats
// @route  GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const streak = await DailyStreak.findOne({ userEmail: user.email });
    const userBadges = await UserAchievement.find({ userEmail: user.email });
    const ranking = await Ranking.findOne({ userEmail: user.email });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        streak: streak ? streak.currentStreak : 1,
        longestStreak: streak ? streak.longestStreak : 1,
        badges: userBadges,
        ranking: ranking ? ranking.rank : null,
        badgeTitle: ranking ? ranking.badge : '🌱 Rising Explorer'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update user profile (name, avatar, password)
// @route  PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Update userName in streaks, rankings, user_achievements if changed
    if (req.body.name) {
      await DailyStreak.updateMany({ userEmail: user.email }, { userName: user.name });
      await Ranking.updateMany({ userEmail: user.email }, { userName: user.name });
      await UserAchievement.updateMany({ userEmail: user.email }, { userName: user.name });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        stars: updatedUser.stars,
        gamesPlayed: updatedUser.gamesPlayed,
        achievements: updatedUser.achievements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all users (admin / leaderboard lookup)
// @route  GET /api/users
// @access Public
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ stars: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
