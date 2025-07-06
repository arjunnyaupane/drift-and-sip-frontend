import Order from '../models/orderModel.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js'; // ✅ added

// ✅ Get orders by phone
export async function getOrdersByPhone(req, res) {
  try {
    const { phone } = req.params;
    const orders = await Order.find({ phone });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching by phone:', error);
    res.status(500).json({ message: 'Failed to fetch orders by phone' });
  }
}

// ✅ Get all orders
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

// ✅ Place a new order
export async function placeOrder(req, res) {
  try {
    const { name, phone, deliveryMethod, address, payment, total, items } = req.body;

    const newOrder = new Order({
      name,
      phone,
      deliveryMethod,
      address,
      payment,
      total,
      items,
    });

    await newOrder.save();

    // ✅ Send WhatsApp message
    const message = `
📦 *New Order Placed!*
👤 *Name:* ${name}
📞 *Phone:* ${phone}
🚚 *Delivery:* ${deliveryMethod}
${deliveryMethod === 'Home Delivery' ? `📍 *Address:* ${address}\n` : ''}
💰 *Payment:* ${payment}
🧾 *Total:* Rs. ${total}
🍹 *Items:*
${items.map(i => `- ${i.name} (${i.size}) x${i.quantity}`).join('\n')}
`;

    await sendWhatsAppMessage(process.env.OWNER_PHONE, message); // ✅ actual sending

    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
}

// ✅ Delete order by ID
export async function deleteOrderById(req, res) {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
}
