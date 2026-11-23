import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    emoji: { type: String, default: '🎮' },
    isActive: { type: Boolean, default: true },
    level: { type: String, default: 'Easy' },
    route: { type: String, default: '' }
  },
  {
    timestamps: true,
    collection: 'games'
  }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
