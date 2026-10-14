import express from 'express';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalProtect, getComplaints)
  .post(optionalProtect, createComplaint);

router.route('/:id')
  .get(optionalProtect, getComplaintById)
  .delete(protect, adminOnly, deleteComplaint);

router.patch('/:id/status', optionalProtect, updateComplaintStatus);

export default router;
