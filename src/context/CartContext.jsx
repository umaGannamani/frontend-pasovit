import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // -------------------------------
  // LOAD CART
  // -------------------------------
  const loadCart = useCallback(async () => {
    if (user) {
      try {
        const res = await apiGet("/api/cart");
        setItems(res.items || []);
      } catch (err) {
        console.error("Failed loading cart from server:", err);
        setItems([]);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(local);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // -------------------------------
  // Helper to store in local storage
  // -------------------------------
  const persistLocal = (next) => {
    localStorage.setItem("cart", JSON.stringify(next));
    setItems(next);
  };

  // -------------------------------
  // ADD ITEM
  // -------------------------------
  const addItem = useCallback(
    async (productId, qty = 1, size = "") => {
      if (user) {
        const res = await apiPost("/api/cart/add", { productId, qty, size });
        setItems(res.items || []);
      } else {
        const local = JSON.parse(localStorage.getItem("cart") || "[]");

        const existing = local.find(
          (i) => i.productId === productId && i.size === size
        );

        if (existing) existing.qty += qty;
        else local.push({ productId, qty, size });

        persistLocal(local);
      }
    },
    [user]
  );

  // -------------------------------
  // UPDATE ITEM QTY
  // -------------------------------
  const updateItem = useCallback(
    async (itemId, qty) => {
      if (user) {
        const res = await apiPut("/api/cart/update", { itemId, qty });
        setItems(res.items || []);
      } else {
        let local = JSON.parse(localStorage.getItem("cart") || "[]");

        const it = local.find(
          (i) => i.itemId === itemId || i.productId === itemId
        );
        if (it) it.qty = qty;

        persistLocal(local);
      }
    },
    [user]
  );

  // -------------------------------
  // REMOVE ITEM
  // -------------------------------
const removeItem = useCallback(
  async (itemId) => {
    if (user) {
      try {
        const res = await apiDelete(`/api/cart/remove/${itemId}`);
        setItems(res.items || []);
      } catch (err) {
        console.error("Remove item error:", err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem("cart") || "[]").filter(
        (i) => i.itemId !== itemId && i.productId !== itemId
      );
      persistLocal(local);
    }
  },
  [user]
);


  // -------------------------------
  // MERGE GUEST CART AFTER LOGIN
  // -------------------------------
  const mergeGuestCart = useCallback(async () => {
    if (!user) return;

    const local = JSON.parse(localStorage.getItem("cart") || "[]");
    if (local.length === 0) return;

    try {
      await apiPost("/api/cart/merge", { items: local });
      localStorage.removeItem("cart");
      await loadCart();
    } catch (err) {
      console.warn("Cart merge failed", err);
    }
  }, [user, loadCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        loadCart,
        mergeGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
