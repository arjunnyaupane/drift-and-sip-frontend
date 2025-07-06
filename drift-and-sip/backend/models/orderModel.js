// backend/models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,
      size: String,
    },
  ],
  total: { type: Number, required: true },
  payment: { type: String, required: true },
  deliveryMethod: { type: String, required: true },
  address: { type: String },
  status: { type: String, default: 'pending' },
  timestamp: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
