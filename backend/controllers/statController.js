import GameStat from '../models/GameStat.js';
import User from '../models/User.js';
import GameRecord from '../models/GameRecord.js';

// @desc   Get game statistics
// @route  GET /api/gamestats
// @access Public
export const getGameStats = async (req, res) => {
  try {
    const stats = await GameStat.find().sort({ playCount: -1 });
    res.json({ success: true, count: stats.length, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get aggregated platform stats for dashboard
// @route  GET /api/gamestats/overview
// @access Public
export const getPlatformOverview = async (req, res) => {
  try {
    const totalLearners = await User.countDocuments();
    const totalGamesPlayedResult = await GameRecord.countDocuments();
    const stats = await GameStat.find();
    const totalStars = stats.reduce((acc, curr) => acc + (curr.totalStarsAwarded || 0), 0);

    res.json({
      success: true,
      totalLearners,
      totalGamesPlayed: totalGamesPlayedResult,
      totalStarsAwarded: totalStars,
      popularGames: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
