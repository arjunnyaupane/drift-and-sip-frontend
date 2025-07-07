import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/order');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="cart-page-container">
      <h1 className="cart-page-title">🛍️ Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is currently empty.</p>
          <button className="continue-btn" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item-card">
                <div className="cart-item-left">
                  <img
                    src={item?.image || 'https://via.placeholder.com/100'}
                    alt={item?.name || 'Item'}
                    className="cart-item-image"
                  />
                </div>

                <div className="cart-item-right">
                  <h3 className="item-name">{item?.name || 'No Name'}</h3>
                  <p>Size: {item?.size || 'N/A'}</p>
                  <p>Price: ₹{item?.price?.toFixed(2) || '0.00'}</p>
                  <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>

                  <div className="quantity-buttons">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item.name, item.size)}
                    >
                      -
                    </button>
                    <span className="qty-count">{item?.quantity || 0}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(item.name, item.size)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.name, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-section">
            <h2>🧾 Cart Summary</h2>
            <p>Total Items: {cartItems.length}</p>
            <h3>Total Price: ₹{getTotalPrice()}</h3>

            <div className="cart-summary-buttons">
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <button className="continue-btn" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
