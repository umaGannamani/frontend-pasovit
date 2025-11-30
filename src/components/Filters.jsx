import React from 'react';
import './Filters.css';

export default function Filters({ category, setCategory, search, setSearch }) {
  return (
    <div className="filters">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." />
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Kids">Kids</option>
        <option value="Unisex">Unisex</option>
      </select>
    </div>
  );
}
