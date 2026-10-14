import { storage } from '../utils/storage.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await storage.events.getAll();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching events' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await storage.events.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching event' });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Admin
export const createEvent = async (req, res) => {
  try {
    const { title, category, date, venue, organizer, seats, description } = req.body;

    if (!title || !category || !date || !venue || !organizer) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const created = await storage.events.create({
      title,
      category,
      date,
      venue,
      organizer,
      seats: seats ? Number(seats) : 100,
      taken: 0,
      description: description || ''
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error creating event' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Admin
export const updateEvent = async (req, res) => {
  try {
    const updated = await storage.events.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating event' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await storage.events.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting event' });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Protected
export const registerForEvent = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.body.email || 'demo_student@college.edu';
    const result = await storage.events.register(req.params.id, studentEmail);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json({ message: 'Registered successfully', event: result.event });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error registering for event' });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Protected
export const cancelEventRegistration = async (req, res) => {
  try {
    const studentEmail = (req.user && req.user.email) || req.body.email || 'demo_student@college.edu';
    const result = await storage.events.cancelRegistration(req.params.id, studentEmail);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json({ message: 'Registration cancelled', event: result.event });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error cancelling registration' });
  }
};
