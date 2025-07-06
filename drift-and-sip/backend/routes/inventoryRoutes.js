import express from 'express';
import {
  getInventory,
  addItem,
  updateItem,
  deleteItem,
} from '../controllers/inventoryController.js';

const router = express.Router();

// GET all items
router.get('/', getInventory);

// POST a new item
router.post('/', addItem);

// PUT (update) item by ID
router.put('/:id', updateItem);

// DELETE item by ID
router.delete('/:id', deleteItem);

export default router;
