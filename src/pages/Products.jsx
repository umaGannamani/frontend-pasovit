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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 12;

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (search.trim()) params.append("search", search.trim());
      if (category) params.append("category", category);

      const res = await apiGet(`/api/products?${params.toString()}`);

      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>

        <Filters
          category={category}
          setCategory={(val) => {
            setPage(1); // reset to page 1 when filter changes
            setCategory(val);
          }}
          search={search}
          setSearch={(val) => {
            setPage(1);
            setSearch(val);
          }}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          <div className="products-grid">
            {products.length === 0 ? (
              <p className="no-products">No products found.</p>
            ) : (
              products.map((p) => <ProductCard key={p._id} product={p} />)
            )}
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <button disabled={page === 1} onClick={prevPage}>
              ⬅ Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button disabled={page === totalPages} onClick={nextPage}>
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
