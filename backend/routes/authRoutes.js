import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} from '../controllers/authController.js';
import { protect, optionalProtect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', optionalProtect, logoutUser);
router.get('/me', protect, getMe);

export default router;
