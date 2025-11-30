import React, { useEffect, useState } from 'react';
import './OrderSuccess.css';
import { useParams, Link } from 'react-router-dom';
import { apiGet } from '../services/api';

export default function OrderSuccess(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(()=>{
    (async ()=> {
      try {
        const res = await apiGet(`/api/orders/${id}`);
        setOrder(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-success">
      <h2>Thank you — order placed!</h2>
      <p>Order ID: <strong>{order._id}</strong></p>
      <p>Total: <strong>₹{order.totalPrice}</strong></p>

      <h3>Items</h3>
      <ul>
        {order.items.map(it => <li key={it._id}>{it.name} ({it.size}) x{it.qty} — ₹{it.price}</li>)}
      </ul>

      <p><Link to="/products" className="btn-primary">Continue Shopping</Link></p>
    </div>
  );
}
