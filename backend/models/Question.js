import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    gameTitle: { type: String, required: true },
    questionText: { type: String, required: true },
    emoji: { type: String, default: '❓' },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    hint: { type: String, default: '' },
    difficulty: { type: String, default: 'Easy' }
  },
  {
    timestamps: true,
    collection: 'questions'
  }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
