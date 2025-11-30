import React from 'react';
import './CartItem.css';

export default function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <div className="cart-item">
      <img src={item.image || item.product?.image} alt={item.name || item.product?.name} />
      <div className="cart-info">
        <h4>{item.name || item.product?.name}</h4>
        <p>Size: {item.size || '-'}</p>
        <p>Price: ₹{item.price || item.product?.price}</p>

        <div className="cart-controls">
          <input type="number" min="1" value={item.qty} onChange={e => onQtyChange(item._id || item.productId, Number(e.target.value))} />
          <button className="btn-remove" onClick={()=>onRemove(item._id || item.productId)}>Remove</button>
        </div>
      </div>
    </div>
  );
}
