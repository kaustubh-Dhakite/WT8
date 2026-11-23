import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { seedInitialData } from './utils/seedData.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import gameRecordRoutes from './routes/gameRecordRoutes.js';
import statRoutes from './routes/statRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import streakRoutes from './routes/streakRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  seedInitialData();
});

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend Vite dev server or production client
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🧸 Little Learners REST API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      games: '/api/games',
      questions: '/api/questions',
      gameRecords: '/api/gamerecords',
      gameStats: '/api/gamestats',
      achievements: '/api/achievements',
      rankings: '/api/rankings',
      feedback: '/api/feedback',
      notifications: '/api/notifications',
      streaks: '/api/streaks'
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/gamerecords', gameRecordRoutes);
app.use('/api/gamestats', statRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/streaks', streakRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Little Learners API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
