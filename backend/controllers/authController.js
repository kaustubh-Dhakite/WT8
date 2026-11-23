import User from '../models/User.js';
import Login from '../models/Login.js';
import DailyStreak from '../models/DailyStreak.js';
import Ranking from '../models/Ranking.js';
import Notification from '../models/Notification.js';
import { generateToken } from '../utils/jwt.js';

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Web Browser';

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      await Login.create({
        userEmail: email.toLowerCase(),
        userName: name || '',
        action: 'SIGNUP',
        status: 'FAILED',
        ipAddress,
        userAgent,
        loginTime: new Date()
      });
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please login instead.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      stars: 0,
      gamesPlayed: 0,
      achievements: 0
    });

    // Create initial daily streak
    await DailyStreak.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      bonusStarsEarned: 0,
      currentStreak: 1,
      lastActiveDate: new Date(),
      longestStreak: 1
    });

    // Create initial ranking entry
    const totalUsers = await User.countDocuments();
    await Ranking.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      rank: totalUsers,
      totalStars: 0,
      gamesPlayed: 0,
      achievements: 0,
      badge: '🌱 Rising Explorer'
    });

    // Welcome Notification
    await Notification.create({
      userEmail: user.email,
      title: '🌟 Welcome to Little Learners!',
      message: `Hi ${user.name}! Welcome to your joyful learning journey. Play games and earn stars!`,
      type: 'GENERAL',
      icon: '🧸',
      isRead: false
    });

    // Log successful signup
    await Login.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      action: 'SIGNUP',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      loginTime: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Little Learners 🎉',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stars: user.stars,
        gamesPlayed: user.gamesPlayed,
        achievements: user.achievements
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Authenticate user & get token
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Web Browser';

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await user.matchPassword(password))) {
      await Login.create({
        userEmail: email.toLowerCase().trim(),
        userName: user ? user.name : 'Unknown',
        action: 'LOGIN',
        status: 'FAILED',
        ipAddress,
        userAgent,
        loginTime: new Date()
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please try again.'
      });
    }

    // Update Daily Streak
    let streakDoc = await DailyStreak.findOne({ userEmail: user.email });
    const now = new Date();
    if (streakDoc) {
      const lastActive = new Date(streakDoc.lastActiveDate);
      const diffHours = (now - lastActive) / (1000 * 60 * 60);

      if (diffHours >= 20 && diffHours <= 48) {
        streakDoc.currentStreak += 1;
        if (streakDoc.currentStreak > streakDoc.longestStreak) {
          streakDoc.longestStreak = streakDoc.currentStreak;
        }
        streakDoc.bonusStarsEarned += 5;
        streakDoc.lastActiveDate = now;
        await streakDoc.save();

        user.stars += 5;
        await user.save();

        await Notification.create({
          userEmail: user.email,
          title: '🔥 Daily Streak Kept!',
          message: `You reached a ${streakDoc.currentStreak}-day learning streak! +5 bonus stars earned!`,
          type: 'STREAK',
          icon: '🔥',
          isRead: false
        });
      } else if (diffHours > 48) {
        streakDoc.currentStreak = 1;
        streakDoc.lastActiveDate = now;
        await streakDoc.save();
      }
    } else {
      streakDoc = await DailyStreak.create({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        bonusStarsEarned: 0,
        currentStreak: 1,
        lastActiveDate: now,
        longestStreak: 1
      });
    }

    // Log successful login
    await Login.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      action: 'LOGIN',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      loginTime: now
    });

    res.json({
      success: true,
      message: 'Login successful! Welcome back! 🎉',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stars: user.stars,
        gamesPlayed: user.gamesPlayed,
        achievements: user.achievements,
        streak: streakDoc ? streakDoc.currentStreak : 1
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current logged in user
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const streak = await DailyStreak.findOne({ userEmail: user.email });
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        streak: streak ? streak.currentStreak : 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Record user logout
// @route  POST /api/auth/logout
// @access Private / Public
export const logoutUser = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : req.body.email || 'guest@littlelearners.com';
    const userName = req.user ? req.user.name : req.body.name || 'User';

    await Login.create({
      userId: req.user ? req.user._id : null,
      userEmail,
      userName,
      action: 'LOGOUT',
      status: 'SUCCESS',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Web Browser',
      loginTime: new Date()
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
