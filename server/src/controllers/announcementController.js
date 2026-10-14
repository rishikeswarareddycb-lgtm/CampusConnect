import { storage } from '../utils/storage.js';

// @desc    Get all announcements (pinned first, then newest)
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await storage.announcements.getAll();
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching announcements' });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await storage.announcements.getById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.json(announcement);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching announcement' });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin
export const createAnnouncement = async (req, res) => {
  try {
    const { title, category, date, pinned, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const created = await storage.announcements.create({
      title,
      category: category || 'General',
      date: date || new Date().toISOString().slice(0, 10),
      pinned: Boolean(pinned),
      body
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error creating announcement' });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Admin
export const updateAnnouncement = async (req, res) => {
  try {
    const updated = await storage.announcements.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating announcement' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await storage.announcements.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting announcement' });
  }
};
