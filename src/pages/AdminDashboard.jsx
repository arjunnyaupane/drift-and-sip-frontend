import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [adminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filter, search, startDate, endDate]);

  const applyFilters = () => {
    let updated = [...orders];

    if (filter !== 'all') {
      updated = updated.filter(order => order.status === filter);
    }

    if (search.trim()) {
      updated = updated.filter(order =>
        order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const from = new Date(startDate);
      const to = new Date(endDate);
      if (from <= to) {
        updated = updated.filter(order => {
          const orderDate = new Date(order.timestamp || order.date || new Date());
          return orderDate >= from && orderDate <= to;
        });
      }
    }

    setFilteredOrders(updated);
  };

  const findOrderIndex = (order) => {
    return orders.findIndex(o => o.timestamp === order.timestamp && o.phone === order.phone && o.name === order.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleStatusChange = (order, newStatus) => {
    const index = findOrderIndex(order);
    if (index === -1) return;

    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleDelete = (order) => {
    const index = findOrderIndex(order);
    if (index === -1) return;

    const confirm = window.confirm('Are you sure you want to delete this order?');
    if (!confirm) return;

    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const exportToExcel = async () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'S.N.', key: 'sn', width: 5 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Items', key: 'items', width: 40 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Payment', key: 'payment', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Delivery Method', key: 'deliveryMethod', width: 18 },
    ];

    filteredOrders.forEach((order, index) => {
      worksheet.addRow({
        sn: index + 1,
        name: order.name,
        phone: order.phone,
        items: order.items.map(i => `${i.name} x${i.quantity} (${i.size})`).join(', '),
        total: order.total,
        payment: order.payment,
        status: order.status || 'pending',
        deliveryMethod: order.deliveryMethod,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DriftAndSip_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderItems = (items) =>
    items.map((item, idx) => (
      <div key={idx} className="item-line">
        🥤 {item.name} <strong>x{item.quantity}</strong> ({item.size})
      </div>
    ));

  const totalOrders = filteredOrders.length;
  const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').length;
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
  const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;
  const totalRevenue = filteredOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>☕ Drift & Sip Admin Dashboard</h2>
        <div className="admin-actions">
          <span className="welcome">Welcome, {adminName}!</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="date-filters">
          <label>📅 From:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>📅 To:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
        </div>

        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          <button className={filter === 'delivered' ? 'active' : ''} onClick={() => setFilter('delivered')}>Delivered</button>
          <button className={filter === 'cancelled' ? 'active' : ''} onClick={() => setFilter('cancelled')}>Cancelled</button>
          <button className="export-btn" onClick={exportToExcel}>📥 Export Excel</button>
        </div>
      </div>

      <div className="orders-section">
        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card total"><h4>Total Orders</h4><p>{totalOrders}</p></div>
              <div className="stat-card delivered"><h4>Delivered</h4><p>{deliveredOrders}</p></div>
              <div className="stat-card pending"><h4>Pending</h4><p>{pendingOrders}</p></div>
              <div className="stat-card cancelled"><h4>Cancelled</h4><p>{cancelledOrders}</p></div>
              <div className="stat-card revenue"><h4>Total Revenue</h4><p>₹{totalRevenue}</p></div>
            </div>

            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <p className="no-orders">No matching orders found.</p>
              ) : (
                filteredOrders.map((order, index) => (
                  <div
                    key={index}
                    className="order-card"
                    onClick={() => openModal(order)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="order-header">
                      <h4>{order.name}</h4>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order, e.target.value);
                        }}
                        className={`status-dropdown ${order.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <p><strong>📞 Phone:</strong> {order.phone}</p>
                    <p><strong>💰 Total:</strong> ₹{order.total}</p>
                    <p><strong>💳 Payment:</strong> {order.payment}</p>
                    <p><strong>🚚 Delivery:</strong> {order.deliveryMethod}</p>
                    <div className="items-list">
                      <strong>🧾 Items:</strong>
                      {renderItems(order.items)}
                    </div>

                    {/* 🗑️ Delete Button */}
                    <div className="order-actions">
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="order-modal-overlay" onClick={closeModal}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>❌ Close</button>
            <h2>📋 Order Details</h2>
            <p><strong>👤 Name:</strong> {selectedOrder.name}</p>
            <p><strong>📞 Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>💳 Payment:</strong> {selectedOrder.payment}</p>
            <p><strong>🚚 Delivery:</strong> {selectedOrder.deliveryMethod}</p>
            <p><strong>💰 Total:</strong> ₹{selectedOrder.total}</p>
            <div className="modal-items">
              <h4>🧾 Items:</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="modal-item-line">
                  {item.name} x{item.quantity} ({item.size})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="admin-footer">
        <p>© {new Date().getFullYear()} Drift and Sip Admin Panel | Built with ❤️</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
