import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    gameTitle: { type: String, default: 'General' }
  },
  {
    timestamps: true,
    collection: 'feedback'
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
