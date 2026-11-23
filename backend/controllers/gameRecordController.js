import GameRecord from '../models/GameRecord.js';
import GameStat from '../models/GameStat.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import Ranking from '../models/Ranking.js';
import Notification from '../models/Notification.js';

// Helper to update rankings table
async function refreshRankings() {
  try {
    const allUsers = await User.find().sort({ stars: -1, gamesPlayed: -1 });
    let rank = 1;
    for (const u of allUsers) {
      let badge = '🌱 Rising Explorer';
      if (u.stars >= 120) badge = '👑 Grand Champion';
      else if (u.stars >= 90) badge = '🥈 Super Star Explorer';
      else if (u.stars >= 60) badge = '🥉 Master Detective';
      else if (u.stars >= 30) badge = '⭐ Star Learner';

      await Ranking.findOneAndUpdate(
        { userEmail: u.email },
        {
          userId: u._id,
          userEmail: u.email,
          userName: u.name,
          rank: rank++,
          totalStars: u.stars,
          gamesPlayed: u.gamesPlayed,
          achievements: u.achievements,
          badge
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error('Error refreshing rankings:', err);
  }
}

// @desc   Save game record and update stats/achievements/rankings
// @route  POST /api/gamerecords
// @access Public / Private (supports logged in or guest)
export const saveGameRecord = async (req, res) => {
  try {
    const { gameTitle, score, total, starsEarned, userEmail, userName } = req.body;

    if (!gameTitle || score === undefined || total === undefined) {
      return res.status(400).json({
        success: false,
        message: 'gameTitle, score, and total are required'
      });
    }

    const calculatedStars = starsEarned !== undefined ? starsEarned : score;
    const finalEmail = req.user ? req.user.email : (userEmail || 'guest@littlelearners.com');
    const finalName = req.user ? req.user.name : (userName || 'Little Explorer');
    const finalUserId = req.user ? req.user._id : null;

    // 1. Create Game Record
    const record = await GameRecord.create({
      userId: finalUserId,
      userEmail: finalEmail,
      userName: finalName,
      gameTitle,
      score,
      total,
      starsEarned: calculatedStars
    });

    // 2. Update GameStat for this game
    let gameStat = await GameStat.findOne({ gameTitle });
    if (gameStat) {
      gameStat.playCount += 1;
      gameStat.totalStarsAwarded += calculatedStars;
      if (score > gameStat.highScore) {
        gameStat.highScore = score;
      }
      gameStat.lastPlayedAt = new Date();
      await gameStat.save();
    } else {
      gameStat = await GameStat.create({
        gameTitle,
        emoji: '🎮',
        highScore: score,
        lastPlayedAt: new Date(),
        playCount: 1,
        totalStarsAwarded: calculatedStars
      });
    }

    let newlyUnlockedBadges = [];

    // 3. If user exists, update user stats, achievements, rankings
    let user = req.user;
    if (!user && finalEmail !== 'guest@littlelearners.com') {
      user = await User.findOne({ email: finalEmail });
    }

    if (user) {
      user.stars += calculatedStars;
      user.gamesPlayed += 1;

      // Check achievement definitions
      const allAchievements = await Achievement.find();
      const existingUserBadges = await UserAchievement.find({ userEmail: user.email });
      const earnedBadgeIds = existingUserBadges.map((b) => b.badgeId);

      for (const ach of allAchievements) {
        if (!earnedBadgeIds.includes(ach.badgeId)) {
          const meetsGames = user.gamesPlayed >= ach.gamesRequired;
          const meetsStars = user.stars >= ach.starsRequired;

          if (meetsGames && meetsStars) {
            const newBadge = await UserAchievement.create({
              userId: user._id,
              badgeId: ach.badgeId,
              icon: ach.icon,
              title: ach.title,
              unlockedAt: new Date(),
              userEmail: user.email,
              userName: user.name
            });
            newlyUnlockedBadges.push(newBadge);

            // Create notification
            await Notification.create({
              userEmail: user.email,
              title: `⭐ New Badge Unlocked: ${ach.title}!`,
              message: `Hurray! You earned the "${ach.title}" badge: ${ach.description}`,
              type: 'BADGE',
              icon: ach.icon,
              isRead: false
            });
          }
        }
      }

      user.achievements = earnedBadgeIds.length + newlyUnlockedBadges.length;
      await user.save();

      // Refresh Leaderboard
      await refreshRankings();
    }

    res.status(201).json({
      success: true,
      message: 'Game completed and score saved! 🌟',
      record,
      gameStat,
      user: user
        ? {
            id: user._id,
            name: user.name,
            email: user.email,
            stars: user.stars,
            gamesPlayed: user.gamesPlayed,
            achievements: user.achievements
          }
        : null,
      newAchievements: newlyUnlockedBadges
    });
  } catch (error) {
    console.error('Error saving game record:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get user game history
// @route  GET /api/gamerecords/my-history
// @access Private / Public with email query
export const getMyHistory = async (req, res) => {
  try {
    const email = req.user ? req.user.email : req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    const history = await GameRecord.find({ userEmail: email }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: history.length, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all game records (admin / overview)
// @route  GET /api/gamerecords
// @access Public
export const getAllRecords = async (req, res) => {
  try {
    const records = await GameRecord.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
