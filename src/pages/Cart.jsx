import React, { useEffect, useState, useCallback } from "react";
import "./Cart.css";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { apiGet } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, updateItem, loadCart } = useCart();
  const [detailedItems, setDetailedItems] = useState([]);
  const navigate = useNavigate();

  // ------------------------------------------
  // Fetch product details for guest cart items
  // ------------------------------------------
  const fetchGuestProductDetails = useCallback(async () => {
    if (!items || items.length === 0) {
      setDetailedItems([]);
      return;
    }

    // If items coming from backend already contain product details → no need to fetch
    const requiresLookup = items.some((i) => !i.name && !i.product);

    if (!requiresLookup) {
      setDetailedItems(items);
      return;
    }

    try {
      const results = await Promise.all(
        items.map(async (it) => {
          const p = await apiGet(`/api/products/${it.productId}`);
          return {
            ...it,
            product: p,
            name: p.name,
            price: p.price,
            image: p.image,
          };
        })
      );

      setDetailedItems(results);
    } catch (err) {
      console.error("Failed loading product details:", err);
      setDetailedItems(items); // fallback
    }
  }, [items]);

  // Run when cart items change
  useEffect(() => {
    fetchGuestProductDetails();
  }, [fetchGuestProductDetails]);

  // Load cart only once on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ------------------------------------------
  // Calculate subtotal
  // ------------------------------------------
  const subtotal = detailedItems.reduce((total, it) => {
    const price = it.price || it.product?.price || 0;
    return total + price * (it.qty || 1);
  }, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {detailedItems.length === 0 && <p className="empty-cart">Cart is empty</p>}

      {detailedItems.map((item) => (
        <CartItem
          key={item.itemId || item._id || item.productId}
          item={item}
          onRemove={removeItem}
          onQtyChange={updateItem}
        />
      ))}

      {detailedItems.length > 0 && (
        <div className="cart-summary">
          <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
          <button
            className="btn-primary"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
