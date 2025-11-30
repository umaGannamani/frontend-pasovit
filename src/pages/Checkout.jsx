import React, { useState } from 'react';
import './Checkout.css';
import { useCart } from '../context/CartContext';
import { apiPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const { items, loadCart } = useCart();
  const [shipping, setShipping] = useState({ name:'', address:'', city:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const total = items.reduce((s,i)=> s + (i.qty || 1)*(i.price || i.product?.price || 0), 0);

  const handlePlace = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost('/api/orders', { shippingAddress: shipping });
      await loadCart();
      navigate(`/order-success/${res.order._id}`);
    } catch (err) {
      setError(err.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout-wrap">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handlePlace}>
        <input placeholder="Full name" value={shipping.name} onChange={e=>setShipping({...shipping, name:e.target.value})} required />
        <input placeholder="Address" value={shipping.address} onChange={e=>setShipping({...shipping, address:e.target.value})} required />
        <input placeholder="City" value={shipping.city} onChange={e=>setShipping({...shipping, city:e.target.value})} required />
        <input placeholder="Phone" value={shipping.phone} onChange={e=>setShipping({...shipping, phone:e.target.value})} required />
        <div className="checkout-side">
          <p>Total: <strong>₹{total}</strong></p>
          <button className="btn-primary" disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
