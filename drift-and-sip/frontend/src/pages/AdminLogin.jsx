import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await API.post('/admin/login', { username, password });

      // Optional: Store token if returned
      // localStorage.setItem('token', res.data.token);

      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admindashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage('Invalid username or password');
      } else {
        setMessage('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000); // clear error after 3s
    }
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h2>🔐 Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}

export default AdminLogin;

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  margin: '10px',
  width: '250px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  minWidth: '120px',
};
