import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/lostFoundController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(optionalProtect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(optionalProtect, updateItem)
  .patch(optionalProtect, updateItem)
  .delete(protect, deleteItem);

export default router;
