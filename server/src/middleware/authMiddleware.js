import jwt from 'jsonwebtoken';
import { storage } from '../utils/storage.js';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check httpOnly cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'campusconnect_jwt_secret_fallback_key';
    const decoded = jwt.verify(token, secret);

    const user = await storage.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

export const optionalProtect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'campusconnect_jwt_secret_fallback_key';
      const decoded = jwt.verify(token, secret);
      const user = await storage.users.findById(decoded.id);
      if (user) req.user = user;
    } catch (e) {
      // Ignore token failure for optional routes
    }
  }

  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admin privileges required' });
};
