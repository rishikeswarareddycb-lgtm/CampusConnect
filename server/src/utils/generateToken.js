import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'student', expiresIn = '7d') => {
  const secret = process.env.JWT_SECRET || 'campusconnect_jwt_secret_fallback_key';
  return jwt.sign({ id, role }, secret, {
    expiresIn
  });
};
