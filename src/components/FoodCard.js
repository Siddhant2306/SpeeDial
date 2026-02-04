import React, { useState } from "react";
import "../css/FoodCard.css";
import snackImage from "../assets/Screenshot 2025-02-18 072332.png";
import drinkImage from "../assets/Screenshot 2025-02-18 072458.png";

const FoodCards = () => {
  const [snackQty, setSnackQty] = useState(1);
  const [drinkQty, setDrinkQty] = useState(1);

  const placeOrder = async (item, quantity) => {
    try {
      const res = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item, quantity }),
      });

      const data = await res.json();
      alert(`✅ Order placed! Order ID: ${data.order_id}`);
    } catch (err) {
      alert("❌ Failed to place order");
      console.error(err);
    }
  };

  const checkout = async () => {
    // Place two orders (one per item). If your backend supports a combined cart,
    // we can change this to send a single payload.
    await placeOrder("snack", snackQty);
    await placeOrder("drink", drinkQty);
  };

  return (
    <div className="food-container">
      <div className="food-row">
        {/* Snack Card */}
        <div className="food-card">
          <img src={snackImage} alt="Snack" className="food-img" />
          <h3>Delicious Snacks</h3>
          <p>Enjoy crispy and tasty snacks to satisfy your cravings!</p>

          <div className="qty-control">
            <button onClick={() => setSnackQty((q) => Math.max(1, q - 1))}>-</button>
            <span>{snackQty}</span>
            <button onClick={() => setSnackQty((q) => q + 1)}>+</button>
          </div>
        </div>

        {/* Drink Card */}
        <div className="food-card">
          <img src={drinkImage} alt="Drink" className="food-img" />
          <h3>Refreshing Drinks</h3>
          <p>Stay refreshed with our amazing collection of drinks.</p>

          <div className="qty-control">
            <button onClick={() => setDrinkQty((q) => Math.max(1, q - 1))}>-</button>
            <span>{drinkQty}</span>
            <button onClick={() => setDrinkQty((q) => q + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* Cart Card (below) */}
      <div className="food-card cart-card">
        <img src={drinkImage} alt="Cart" className="food-img" />
        <h3>Cart</h3>
        <p className="cart-lines">
          Snacks: <b>{snackQty}</b>
          <br />
          Drinks: <b>{drinkQty}</b>
        </p>

        <button className="buy-btn" onClick={checkout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default FoodCards;
