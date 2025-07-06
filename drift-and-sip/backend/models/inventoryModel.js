import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem; // ✅ This is the missing part!
