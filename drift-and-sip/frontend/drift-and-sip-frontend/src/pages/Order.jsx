import React, { useContext, useEffect, useState } from 'react';
import API from '../api'; // ✅ Use this instead

import { CartContext } from '../context/CartContext';
import './Order.css';

// QR placeholder images
const QR_IMAGES = {
  eSewa: 'https://via.placeholder.com/200x200?text=eSewa+QR',
  Khalti: 'https://via.placeholder.com/200x200?text=Khalti+QR',
  'Bank QR': 'https://via.placeholder.com/200x200?text=Bank+QR',
};

const BASE_URL = 'http://localhost:5000';

function Order() {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryMethod: 'Home Delivery',
    payment: 'Cash',
  });

  const [submitted, setSubmitted] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const paymentOptions = ['Cash', 'eSewa', 'Khalti', 'Bank QR'];

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      payment:prev.payment || paymentOptions[0],
    }));
  }, [formData.deliveryMethod]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone) => /^9[678]\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty! Please add items before placing an order.');
      return;
    }

    if (!isValidPhone(formData.phone)) {
      alert('Please enter a valid Nepali phone number (e.g., 98XXXXXXXX).');
      return;
    }

    if (formData.deliveryMethod === 'Home Delivery' && formData.address.trim() === '') {
      alert('Please enter your delivery address.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/orders', {

        name: formData.name,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
        payment: formData.payment,
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          image: item.image || '',
        })),
      });

      console.log('✅ Order placed:', response.data);

     setSubmitted(true);

// simulate delay in sending message to owner (1.5 seconds)
setTimeout(() => {
  setMessageSent(true);
}, 1500);

clearCart();

    } catch (error) {
      console.error('❌ Order failed:', error.response?.data || error.message);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      deliveryMethod: 'Home Delivery',
      payment: paymentOptions[0],
    });
    setSubmitted(false);
    setMessageSent(false);
  };

  const qrImage = QR_IMAGES[formData.payment];

  if (submitted) {
    return (
      <div className="order-confirmation">
        <h2>Order Confirmed!</h2>
        <p>Thank you, <strong>{formData.name}</strong>! Your order has been placed.</p>

        <div className="order-summary">
          <h3>Order Details</h3>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Delivery Method:</strong> {formData.deliveryMethod}</p>
          {formData.deliveryMethod === 'Home Delivery' && (
            <p><strong>Address:</strong> {formData.address}</p>
          )}
          <p><strong>Payment Method:</strong> {formData.payment}</p>
          <p><strong>Total Paid:</strong> ₹{getTotalPrice()}</p>

          {qrImage && ['eSewa', 'Khalti', 'Bank QR'].includes(formData.payment) && (
            <div className="qr-section">
              <p>Scan this QR to complete payment:</p>
              <img src={qrImage} alt="QR Code" className="qr-code" />
            </div>
          )}

          {formData.deliveryMethod === 'Home Delivery' ? (
            <p className="delivery-note">Your order will be delivered within 45-60 minutes.</p>
          ) : (
            <p className="delivery-note">Please be ready to pay when you arrive at the café.</p>
          )}
        </div>

        <div className="owner-message">
          {messageSent ? (
            <div className="whatsapp-box">
              <p><strong>Sent to Owner:</strong></p>
              <div className="whatsapp-bubble">
                <p><strong>{formData.name}</strong> has placed an order!</p>
                <p>📞 {formData.phone}</p>
                <p>🚚 {formData.deliveryMethod}</p>
                {formData.deliveryMethod === 'Home Delivery' && (
                  <p>📍 {formData.address}</p>
                )}
                <p>💰 Payment: {formData.payment}</p>
                <p>🧾 Total: ₹{getTotalPrice()}</p>
              </div>
            </div>
          ) : (
            <p>Sending message to owner...</p>
          )}
        </div>

        <button onClick={handleReset} className="new-order-btn">
          Place New Order
        </button>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h2>Place Your Order</h2>
      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            required
            onChange={handleChange}
            value={formData.name}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            required
            onChange={handleChange}
            value={formData.phone}
            placeholder="98XXXXXXXX"
            maxLength={10}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryMethod">Delivery Method</label>
          <select
            id="deliveryMethod"
            name="deliveryMethod"
            onChange={handleChange}
            value={formData.deliveryMethod}
          >
            <option value="Home Delivery">Home Delivery</option>
            <option value="Dine-In">Dine-In (Physical Café)</option>
          </select>
        </div>

        {formData.deliveryMethod === 'Home Delivery' && (
          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              required
              onChange={handleChange}
              value={formData.address}
              placeholder="Enter delivery address"
            ></textarea>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="payment">Payment Method</label>
          <select
            id="payment"
            name="payment"
            onChange={handleChange}
            value={formData.payment}
          >
            {paymentOptions.map((option, index) => (
              <option value={option} key={index}>{option}</option>
            ))}
          </select>
        </div>

        {['eSewa', 'Khalti', 'Bank QR'].includes(formData.payment) && (
          <div className="qr-section">
            <p>Scan this QR code to pay:</p>
            <img
              src={qrImage}
              alt="QR Code"
              className="qr-code"
              style={{ width: '200px', borderRadius: '8px' }}
            />
          </div>
        )}

        <h3 className="cart-preview-title">🛒 Cart Preview</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="order-cart-preview">
            {cartItems.map((item, index) => (
              <div className="order-cart-item" key={index}>
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div>
                  <p><strong>{item.name}</strong> ({item.size})</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="order-total">Total: ₹{getTotalPrice()}</div>
          </div>
        )}

        <button
          type="submit"
          className="submit-order-btn"
          disabled={cartItems.length === 0 || loading}
          style={{
            opacity: cartItems.length === 0 || loading ? 0.5 : 1,
            cursor: cartItems.length === 0 || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
}

export default Order;
