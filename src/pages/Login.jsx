import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // after login, merge guest cart to server
      await mergeGuestCart();
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handle}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button className="btn-primary" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have account? <Link to="/register">Register</Link></p>
    </div>
  );
}
