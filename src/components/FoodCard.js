import React from 'react';
import '../css/FoodCard.css'; // Import styles
import snackImage from '../assets/Screenshot 2025-02-18 072332.png'; // Replace with your image
import drinkImage from '../assets/Screenshot 2025-02-18 072458.png'; // Replace with your image

const FoodCards = () => {
  return (
    <div className="food-container">
      {/* Snack Card */}
      <div className="food-card">
        <img src={snackImage} alt="Snack" className="food-img" />
        <h3>Delicious Snacks</h3>
        <p>Enjoy crispy and tasty snacks to satisfy your cravings!</p>
        <button className="buy-btn">Order Snacks</button>
      </div>

      {/* Drink Card */}
      <div className="food-card">
        <img src={drinkImage} alt="Drink" className="food-img" />
        <h3>Refreshing Drinks</h3>
        <p>Stay refreshed with our amazing collection of drinks.</p>
        <button className="buy-btn">Order Drinks</button>
      </div>
    </div>
  );
};

export default FoodCards;
