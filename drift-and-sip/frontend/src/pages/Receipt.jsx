import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import './Receipt.css';

function Receipt() {
  const { cartItems, getTotalPrice } = useContext(CartContext);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryMethod: '',
    paymentMethod: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('drift_order');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="receipt-container">
        <h2>📄 Receipt</h2>
        <p>No recent orders found.</p>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <h2>📄 Receipt</h2>
      <div className="receipt-box">
        <p><strong>Customer:</strong> {userData.name}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Delivery:</strong> {userData.deliveryMethod}</p>
        {userData.deliveryMethod === 'Home Delivery' && (
          <p><strong>Address:</strong> {userData.address}</p>
        )}
        <p><strong>Payment:</strong> {userData.paymentMethod}</p>

        <hr />

        <h4>🛒 Items Ordered:</h4>
        {cartItems.map((item, index) => (
          <div key={index} className="receipt-item">
            <span>{item.name} ({item.size}) × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <hr />
        <h3>Total: ₹{getTotalPrice()}</h3>

        <button onClick={() => window.print()} className="print-btn">
          🖨️ Print / Download Receipt
        </button>
      </div>
    </div>
  );
}

export default Receipt;
