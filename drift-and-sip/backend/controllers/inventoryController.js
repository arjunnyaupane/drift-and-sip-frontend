import InventoryItem from '../models/inventoryModel.js';

// ✅ Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

// ✅ Add new item
export const addItem = async (req, res) => {
  try {
    const { name, size, price, available } = req.body;

    const newItem = new InventoryItem({
      name,
      size,
      price,
      available,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added', item: newItem });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add item' });
  }
};

// ✅ Update item
export const updateItem = async (req, res) => {
  try {
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item updated', item: updated });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// ✅ Delete item
export const deleteItem = async (req, res) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
};
