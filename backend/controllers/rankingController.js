import Ranking from '../models/Ranking.js';

// @desc   Get full rankings / leaderboard
// @route  GET /api/rankings
// @access Public
export const getRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find().sort({ rank: 1 });
    res.json({ success: true, count: rankings.length, rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
