import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="card">
      <div className="card-img-wrap">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">₹{product.price}</p>
      </div>
    </Link>
  );
}
