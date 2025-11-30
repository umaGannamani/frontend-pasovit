import React, { useEffect, useState, useCallback } from "react";
import "./Products.css";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import { apiGet } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 useCallback to fix missing dependency warning
  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category) params.append("category", category);

      const res = await apiGet(`/api/products?${params.toString()}`);

      // backend may return either array or { products: [] }
      const list = Array.isArray(res) ? res : res.products;

      setProducts(list || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]); // ← dependencies added safely

  // ⬇️ now useEffect has all required deps
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>

        <Filters
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            products.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      )}
    </div>
  );
}
