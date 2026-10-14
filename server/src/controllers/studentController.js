import bcrypt from 'bcryptjs';
import { storage } from '../utils/storage.js';

// @desc    Get current student/user profile
// @route   GET /api/students/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await storage.users.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      ...user,
      id: user._id || user.id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update current student/user profile
// @route   PUT /api/students/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, department, year, cur, currentPassword, nw, newPassword } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (year) updateData.year = year;

    const oldPw = cur || currentPassword;
    const newPw = nw || newPassword;

    if (newPw) {
      if (oldPw) {
        const fullUser = await storage.users.findByEmail(req.user.email, true);
        const isMatch = await bcrypt.compare(oldPw, fullUser.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
      }
      updateData.password = newPw;
    }

    const updatedUser = await storage.users.update(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      ...updatedUser,
      id: updatedUser._id || updatedUser.id
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
