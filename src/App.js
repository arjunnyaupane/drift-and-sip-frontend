import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Receipt from './pages/Receipt';
import Order from './pages/Order';
import BubbleTea from './pages/BubbleTea';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Inventory from './pages/Inventory'; // ✅ NEW

import { CartProvider } from './context/CartContext';
import logo from './assets/drift-logo.png';

// App component
function App() {
  return (
    <CartProvider>
      <Router>
        {/* Navbar */}
        <nav style={navStyle}>
          <div style={logoContainer}>
            <img src={logo} alt="Drift and Sip" style={logoStyle} />
            <h2 style={{ color: 'white', marginLeft: '10px' }}>Drift and Sip</h2>
          </div>

          <div style={navLinksContainer}>
            <Link to="/" style={navLink}>Home</Link>
            <Link to="/menu" style={navLink}>Menu</Link>
            <Link to="/cart" style={navLink}>Cart</Link>
            <Link to="/receipt" style={navLink}>Receipt</Link>
            <Link to="/order" style={navLink}>Order</Link>
           {localStorage.getItem('adminLoggedIn') === 'true' && (
  <Link to="/inventory" style={navLink}>Inventory</Link>
)}

            <Link to="/admin" style={navLink}>Admin</Link>
            <Link to="/admin-login" style={navLink}>Admin Login</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/order" element={<Order />} />
          <Route path="/bubble-tea" element={<BubbleTea />} />
          <Route path="/inventory" element={<Inventory />} /> {/* ✅ NEW */}

          {/* Protected Admin Dashboard */}
          <Route 
            path="/admindashboard" 
            element={
              localStorage.getItem('adminLoggedIn') === 'true' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            } 
          />

          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Redirect /admin to either dashboard or login */}
          <Route
            path="/admin"
            element={
              localStorage.getItem('adminLoggedIn') === 'true' ? (
                <Navigate to="/admindashboard" replace />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />

          {/* Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

// Inline styles
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#2c2c2c',
  padding: '12px 24px',
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle = {
  height: '40px',
  width: '40px',
  borderRadius: '50%',
};

const navLinksContainer = {
  display: 'flex',
  gap: '20px',
};

const navLink = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '16px',
};
