import Question from '../models/Question.js';

// @desc   Get questions (filtered optionally by gameTitle)
// @route  GET /api/questions
// @access Public
export const getQuestions = async (req, res) => {
  try {
    const { gameTitle } = req.query;
    const filter = gameTitle ? { gameTitle: new RegExp(`^${gameTitle}$`, 'i') } : {};
    const questions = await Question.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new question (CRUD POST)
// @route  POST /api/questions
// @access Public
export const createQuestion = async (req, res) => {
  try {
    const { gameTitle, questionText, emoji, options, correctAnswer, hint, difficulty } = req.body;

    if (!gameTitle || !questionText || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'gameTitle, questionText, options, and correctAnswer are required.'
      });
    }

    const question = await Question.create({
      gameTitle,
      questionText,
      emoji: emoji || '❓',
      options,
      correctAnswer,
      hint: hint || '',
      difficulty: difficulty || 'Easy'
    });

    res.status(201).json({ success: true, message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete question by ID (CRUD DELETE)
// @route  DELETE /api/questions/:id
// @access Public
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    await question.deleteOne();
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
