import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import bg from "../assets/food-wallpaper.svg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home" style={{ backgroundImage: `url(${bg})` }}>
      <div className="home-overlay" />

      <div className="home-content">
        <div className="badge">SpeeDial</div>
        <h1 className="title">
          Order snacks & drinks
          <span className="title-accent"> fast</span>
        </h1>
        <p className="subtitle">
          SpeeDial is a simple ordering experience built for speed — pick items,
          add to cart, and place your order in seconds.
        </p>

        <div className="cta-row">
          <button className="cta" onClick={() => navigate("/shop")}>Shop now</button>
          <button className="cta secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-num">⚡</div>
            <div className="stat-label">Fast checkout</div>
          </div>
          <div className="stat">
            <div className="stat-num">🛒</div>
            <div className="stat-label">Cart-based ordering</div>
          </div>
          <div className="stat">
            <div className="stat-num">🔒</div>
            <div className="stat-label">User login support</div>
          </div>
        </div>
      </div>

      <div className="glow g1" />
      <div className="glow g2" />
    </div>
  );
};

export default HomePage;
