import { storage } from '../utils/storage.js';

// @desc    Get all lost and found items (with filters)
// @route   GET /api/lost-found
// @access  Public
export const getItems = async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      status: req.query.status,
      q: req.query.q || req.query.search
    };

    const items = await storage.lostFound.getAll(filters);
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching lost & found items' });
  }
};

// @desc    Get single item
// @route   GET /api/lost-found/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await storage.lostFound.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching item' });
  }
};

// @desc    Report lost or found item
// @route   POST /api/lost-found
// @access  Protected / Public
export const createItem = async (req, res) => {
  try {
    const { type, name, category, date, location, description, contact, image } = req.body;

    if (!type || !name || !category || !location || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const itemData = {
      type: type === 'Found' ? 'Found' : 'Lost',
      name,
      category,
      status: 'Open',
      location,
      date: date || new Date().toISOString().slice(0, 10),
      description,
      contact: contact || 'Email',
      image: image || null,
      verified: false,
      reportedBy: (req.user && req.user.email) || 'student'
    };

    const created = await storage.lostFound.create(itemData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error reporting item' });
  }
};

// @desc    Update lost & found item
// @route   PUT /api/lost-found/:id or PATCH /api/lost-found/:id
// @access  Protected
export const updateItem = async (req, res) => {
  try {
    const updated = await storage.lostFound.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating item' });
  }
};

// @desc    Delete item
// @route   DELETE /api/lost-found/:id
// @access  Protected / Admin
export const deleteItem = async (req, res) => {
  try {
    const deleted = await storage.lostFound.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting item' });
  }
};
