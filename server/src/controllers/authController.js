import bcrypt from 'bcryptjs';
import { storage } from '../utils/storage.js';
import { generateToken } from '../utils/generateToken.js';

// Cookie options
const getCookieOptions = (days = 7) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: days * 24 * 60 * 60 * 1000
});

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, sid, studentId, dept, department, year, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await storage.users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const assignedRole = role || (email.toLowerCase().includes('admin') ? 'admin' : 'student');
    const assignedId = studentId || sid || (assignedRole === 'admin' ? 'ADM' + Math.floor(100 + Math.random() * 900) : 'CS' + Math.floor(21000 + Math.random() * 900));
    const assignedDept = department || dept || (assignedRole === 'admin' ? 'Administration' : 'Computer Science');

    const user = await storage.users.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      studentId: assignedId,
      department: assignedDept,
      year: year || (assignedRole === 'admin' ? 'Staff' : '1st')
    });

    const token = generateToken(user._id || user.id, user.role);
    res.cookie('token', token, getCookieOptions(7));

    const responseData = {
      ...user,
      id: user._id || user.id,
      token,
      user: {
        ...user,
        id: user._id || user.id
      }
    };

    return res.status(201).json(responseData);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await storage.users.findByEmail(email, true);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const days = remember ? 30 : 7;
    const token = generateToken(user._id || user.id, user.role, `${days}d`);
    res.cookie('token', token, getCookieOptions(days));

    const { password: _, ...safeUser } = user;
    const responseData = {
      ...safeUser,
      id: safeUser._id || safeUser.id,
      token,
      user: {
        ...safeUser,
        id: safeUser._id || safeUser.id
      }
    };

    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Login failed' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return res.json({ message: 'Logged out successfully' });
};
