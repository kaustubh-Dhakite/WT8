import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'little_learners_super_secret_jwt_key_2026_mitaoe',
    { expiresIn: '30d' }
  );
};
