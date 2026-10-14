import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAnnouncements)
  .post(optionalProtect, createAnnouncement);

router.route('/:id')
  .get(getAnnouncementById)
  .put(optionalProtect, updateAnnouncement)
  .delete(optionalProtect, deleteAnnouncement);

export default router;
