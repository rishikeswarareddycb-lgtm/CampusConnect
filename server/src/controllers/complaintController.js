import { storage } from '../utils/storage.js';

// @desc    Get all complaints (with filters)
// @route   GET /api/complaints
// @access  Public / Protected
export const getComplaints = async (req, res) => {
  try {
    const filters = {
      q: req.query.q || req.query.search,
      category: req.query.category,
      status: req.query.status,
      range: req.query.range,
      student: req.query.student
    };

    const complaints = await storage.complaints.getAll(filters);
    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching complaints' });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Public / Protected
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await storage.complaints.getById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching complaint' });
  }
};

// @desc    Submit a complaint
// @route   POST /api/complaints
// @access  Protected / Public with student name
export const createComplaint = async (req, res) => {
  try {
    const { title, category, priority, location, description, image, student, studentEmail } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const complaintData = {
      title,
      category,
      priority: priority || 'Medium',
      location,
      description,
      image: image || null,
      student: (req.user && req.user.name) || student || 'Anonymous Student',
      studentEmail: (req.user && req.user.email) || studentEmail || 'student@college.edu',
      date: new Date().toISOString().slice(0, 10)
    };

    const created = await storage.complaints.create(complaintData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error submitting complaint' });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Admin / Protected
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Submitted', 'In Progress', 'Resolved', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await storage.complaints.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating complaint' });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Admin
export const deleteComplaint = async (req, res) => {
  try {
    const deleted = await storage.complaints.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting complaint' });
  }
};
