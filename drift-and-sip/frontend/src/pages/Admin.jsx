import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Load orders on mount
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
    setFilteredOrders(storedOrders);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  // Open modal with order details
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Filter orders by status
  const handleFilter = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  // Search orders by name or phone
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = orders.filter(order =>
      order.name.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  // Change order status
  const handleStatusChange = (index, newStatus) => {
    const updated = [...orders];
    updated[index].status = newStatus;
    setOrders(updated);
    setFilteredOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  // Delete order
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updated = [...orders];
      updated.splice(index, 1);
      setOrders(updated);
      setFilteredOrders(updated);
      localStorage.setItem('orders', JSON.stringify(updated));
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <section className="controls">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="filter-buttons">
          {['all', 'pending', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              className={filter === status ? 'active' : ''}
              onClick={() => handleFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="orders-list">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order, idx) => (
            <div
              key={idx}
              className="order-card"
              onClick={() => openModal(order)}
            >
              <div className="order-header">
                <h3>{order.name}</h3>
                <select
                  value={order.status}
                  onClick={e => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(idx, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Payment:</strong> {order.payment}</p>
              <p><strong>Delivery:</strong> {order.deliveryMethod}</p>
              <button
                className="delete-btn"
                onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>

      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>Close</button>
            <h2>Order Details</h2>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment}</p>
            <p><strong>Delivery:</strong> {selectedOrder.deliveryMethod}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            <h4>Items:</h4>
            {selectedOrder.items.map((item, i) => (
              <p key={i}>{item.name} x{item.quantity} ({item.size})</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
