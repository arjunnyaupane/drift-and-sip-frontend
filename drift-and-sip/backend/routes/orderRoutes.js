import express from 'express';
import {
  placeOrder,
  getAllOrders,
  getOrdersByPhone,
  deleteOrderById
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder);
router.get('/', getAllOrders);
router.get('/phone/:phone', getOrdersByPhone);
router.delete('/:id', deleteOrderById); // ✅ THIS IS NEEDED

export default router;
