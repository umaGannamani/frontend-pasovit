import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="home-hero">
      <div className="hero-left">
        <h1>Pasovit — Modern Clothing</h1>
        <p>Comfortable, stylish and affordable clothes for everyone.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
      <div className="hero-right">
        <img src="https://picsum.photos/600/400?fashion" alt="hero" />
      </div>
    </div>
  );
}
