import React, { useMemo, useState } from "react";
import "../css/FoodCard.css";
import snackImage from "../assets/Screenshot 2025-02-18 072332.png";
import drinkImage from "../assets/Screenshot 2025-02-18 072458.png";

const FoodCards = () => {
  // picker quantities (how many you want to add *this time*)
  const [snackQty, setSnackQty] = useState(1);
  const [drinkQty, setDrinkQty] = useState(1);

  // cart quantities (what’s currently in the cart)
  const [cart, setCart] = useState({ snack: 0, drink: 0 });

  const totalItems = useMemo(() => cart.snack + cart.drink, [cart]);

  const addToCart = (item, quantity) => {
    setCart((c) => ({
      ...c,
      [item]: (c[item] || 0) + quantity,
    }));
  };

  const clearCart = () => setCart({ snack: 0, drink: 0 });

  const checkout = async () => {
    try {
      const items = [];
      if (cart.snack > 0) items.push({ item: "snack", quantity: cart.snack });
      if (cart.drink > 0) items.push({ item: "drink", quantity: cart.drink });

      if (items.length === 0) {
        alert("🛒 Cart is empty");
        return;
      }

      const res = await fetch("http://localhost:8080/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      alert(`✅ Order placed! Order IDs: ${(data.order_ids || []).join(", ")}`);
      clearCart();
    } catch (err) {
      alert(`❌ ${err.message}`);
      console.error(err);
    }
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

          <button className="buy-btn" onClick={() => addToCart("snack", snackQty)}>
            Add to cart
          </button>
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

          <button className="buy-btn" onClick={() => addToCart("drink", drinkQty)}>
            Add to cart
          </button>
        </div>
      </div>

      {/* Cart Card (below) */}
      <div className="food-card cart-card">
        <img src={drinkImage} alt="Cart" className="food-img" />
        <h3>Cart</h3>
        <p className="cart-lines">
          Snacks: <b>{cart.snack}</b>
          <br />
          Drinks: <b>{cart.drink}</b>
          <br />
          Total items: <b>{totalItems}</b>
        </p>

        <div className="cart-actions">
          <button className="buy-btn" onClick={checkout}>
            Order now
          </button>
          <button className="buy-btn secondary" onClick={clearCart}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCards;
