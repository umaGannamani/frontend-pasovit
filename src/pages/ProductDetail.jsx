import React, { useEffect, useState } from 'react';
import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');   // ✅ Add size state
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(`/api/products/${id}`);
        setProduct(res);

        // Set default size
        if (res.sizes && res.sizes.length > 0) {
          setSize(res.sizes[0]);
        }

      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAdd = async () => {
    await addItem(product._id, qty, size);  // ✅ send selected size
    navigate('/cart');
  };

  return (
    <div className="pd-wrap">
      <div className="pd-left">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="pd-right">
        <h2>{product.name}</h2>
        <p className="muted">{product.category}</p>
        <p className="pd-price">₹{product.price}</p>
        <p>{product.description}</p>

        <div className="pd-actions">
          {/* Quantity */}
          <label>
            Qty:
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </label>

          {/* Size Dropdown */}
          {product.sizes?.length > 0 && (
            <label>
              Size:
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                {product.sizes.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button className="btn-primary" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
