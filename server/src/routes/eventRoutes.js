import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEventRegistration
} from '../controllers/eventController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(optionalProtect, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(optionalProtect, updateEvent)
  .delete(optionalProtect, deleteEvent);

router.route('/:id/register')
  .post(optionalProtect, registerForEvent)
  .delete(optionalProtect, cancelEventRegistration);

export default router;
