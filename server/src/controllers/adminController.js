import { storage } from '../utils/storage.js';

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Admin
export const getStudents = async (req, res) => {
  try {
    const search = req.query.q || req.query.search || '';
    const students = await storage.users.getAllStudents(search);
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching students' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
export const getStats = async (req, res) => {
  try {
    const stats = await storage.getAdminStats();
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching statistics' });
  }
};
