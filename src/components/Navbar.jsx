import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart } from 'react-icons/fa';

export default function Navbar(){
  const { items } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const totalCount = items.reduce((s, it) => s + (it.qty || 1), 0);

  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Pasovit</Link>
        <Link to="/products" className="nav-link">Shop</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        <Link to="/cart" className="cart-btn" aria-label="Cart">
          <FaShoppingCart />
          <span className="cart-badge">{totalCount}</span>
        </Link>
      </div>
    </header>
  );
}
