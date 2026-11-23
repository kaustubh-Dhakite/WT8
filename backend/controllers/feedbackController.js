import Feedback from '../models/Feedback.js';

// @desc   Get all feedback
// @route  GET /api/feedback
// @access Public
export const getFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbackList.length, feedback: feedbackList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Submit feedback (POST CRUD)
// @route  POST /api/feedback
// @access Public / Private
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment, gameTitle, userName, userEmail } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const email = req.user ? req.user.email : (userEmail || 'anonymous@littlelearners.com');
    const name = req.user ? req.user.name : (userName || 'Parent / Learner');

    const feedback = await Feedback.create({
      userEmail: email,
      userName: name,
      rating: Number(rating),
      comment: comment.trim(),
      gameTitle: gameTitle || 'General'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! ❤️',
      feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete feedback by ID (DELETE CRUD)
// @route  DELETE /api/feedback/:id
// @access Public
export const deleteFeedback = async (req, res) => {
  try {
    const item = await Feedback.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
