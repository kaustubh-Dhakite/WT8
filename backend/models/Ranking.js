import mongoose from 'mongoose';

const rankingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    rank: { type: Number, required: true },
    totalStars: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    badge: { type: String, default: '🌱 Rising Explorer' }
  },
  {
    timestamps: true,
    collection: 'rankings'
  }
);

const Ranking = mongoose.model('Ranking', rankingSchema);
export default Ranking;
