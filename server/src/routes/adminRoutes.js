import express from 'express';
import { getStudents, getStats } from '../controllers/adminController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', optionalProtect, getStudents);
router.get('/stats', optionalProtect, getStats);

export default router;
