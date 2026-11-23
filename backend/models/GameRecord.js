import mongoose from 'mongoose';

const gameRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, default: null },
    userEmail: { type: String, default: 'guest@littlelearners.com' },
    userName: { type: String, default: 'Little Explorer' },
    gameTitle: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    starsEarned: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: 'gamerecords'
  }
);

const GameRecord = mongoose.model('GameRecord', gameRecordSchema);
export default GameRecord;
