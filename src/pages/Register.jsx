import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate('/products');
    } catch (err) { setError(err.message || 'Registration failed'); }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handle}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button className="btn-primary">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
