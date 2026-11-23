import mongoose from 'mongoose';

const gameStatSchema = new mongoose.Schema(
  {
    gameTitle: { type: String, required: true, unique: true },
    emoji: { type: String, default: '🎮' },
    highScore: { type: Number, default: 0 },
    lastPlayedAt: { type: Date, default: Date.now },
    playCount: { type: Number, default: 0 },
    totalStarsAwarded: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: 'gamestats'
  }
);

const GameStat = mongoose.model('GameStat', gameStatSchema);
export default GameStat;
