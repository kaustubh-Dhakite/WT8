import Game from '../models/Game.js';

// @desc   Get all games
// @route  GET /api/games
// @access Public
export const getGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true }).sort({ createdAt: 1 });
    res.json({ success: true, count: games.length, games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single game by ID or title
// @route  GET /api/games/:id
// @access Public
export const getGameById = async (req, res) => {
  try {
    let game;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      game = await Game.findById(req.params.id);
    } else {
      game = await Game.findOne({ title: req.params.id });
    }

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    res.json({ success: true, game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create a game (admin / CRUD demonstration)
// @route  POST /api/games
// @access Public
export const createGame = async (req, res) => {
  try {
    const { title, category, description, emoji, level, route } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Game title is required' });
    }

    const game = await Game.create({
      title,
      category: category || 'General',
      description: description || '',
      emoji: emoji || '🎮',
      level: level || 'Easy',
      route: route || ''
    });

    res.status(201).json({ success: true, message: 'Game created successfully', game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
