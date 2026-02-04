import React, { useMemo, useState } from "react";
import "../css/shop.css";
import snackImage from "../assets/Screenshot 2025-02-18 072332.png";
import drinkImage from "../assets/Screenshot 2025-02-18 072458.png";

const PRODUCTS = [
  // Snacks
  {
    id: "chips",
    name: "Classic Chips",
    desc: "Crispy salted chips for the perfect crunch.",
    type: "snack",
    image: snackImage,
  },
  {
    id: "nachos",
    name: "Cheesy Nachos",
    desc: "Loaded nachos with a cheesy kick.",
    type: "snack",
    image: snackImage,
  },
  {
    id: "cookies",
    name: "Choco Cookies",
    desc: "Soft cookies with chocolate chunks.",
    type: "snack",
    image: snackImage,
  },

  // Drinks
  {
    id: "cola",
    name: "Cola",
    desc: "Ice-cold fizzy refreshment.",
    type: "drink",
    image: drinkImage,
  },
  {
    id: "lemonade",
    name: "Lemonade",
    desc: "Fresh and tangy.",
    type: "drink",
    image: drinkImage,
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    desc: "Sweet, chilled, and smooth.",
    type: "drink",
    image: drinkImage,
  },
];

const ShopPage = () => {
  const [pickerQty, setPickerQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  );
  const [cart, setCart] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, q) => sum + q, 0),
    [cart]
  );

  const addToCart = (productId) => {
    const qty = pickerQty[productId] || 1;
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + qty }));
  };

  const removeFromCart = (productId) => {
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });
  };

  const clearCart = () => setCart({});

  const checkout = async () => {
    try {
      const items = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, qty]) => ({ item: productId, quantity: qty }));

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
      setCartOpen(false);
    } catch (err) {
      alert(`❌ ${err.message}`);
      console.error(err);
    }
  };

  const snacks = PRODUCTS.filter((p) => p.type === "snack");
  const drinks = PRODUCTS.filter((p) => p.type === "drink");

  const cartLines = Object.entries(cart).map(([productId, qty]) => {
    const p = PRODUCTS.find((x) => x.id === productId);
    return { id: productId, name: p?.name || productId, qty };
  });

  return (
    <div className="shop">
      <div className="shop-inner">
        <div className="shop-hero">
          <div>
            <div className="shop-pill">SpeeDial • Shop</div>
            <h2 className="shop-title">Grab your favorites</h2>
            <p className="shop-subtitle">
              Pick items, add to cart, then place one order.
            </p>
          </div>
          <div className="shop-hero-right">
            <div className="shop-mini-stat">
              <div className="ms-num">{cartCount}</div>
              <div className="ms-label">items in cart</div>
            </div>
          </div>
        </div>

        <h3 className="section-title">Snacks</h3>
        <div className="grid">
          {snacks.map((p) => (
            <div className="food-card" key={p.id}>
              <img src={p.image} alt={p.name} className="food-img" />
              <h3>{p.name}</h3>
              <p>{p.desc}</p>

              <div className="qty-control">
                <button
                  onClick={() =>
                    setPickerQty((q) => ({
                      ...q,
                      [p.id]: Math.max(1, (q[p.id] || 1) - 1),
                    }))
                  }
                >
                  -
                </button>
                <span>{pickerQty[p.id] || 1}</span>
                <button
                  onClick={() =>
                    setPickerQty((q) => ({
                      ...q,
                      [p.id]: (q[p.id] || 1) + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>

              <button className="buy-btn" onClick={() => addToCart(p.id)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>

        <h3 className="section-title">Drinks</h3>
        <div className="grid">
          {drinks.map((p) => (
            <div className="food-card" key={p.id}>
              <img src={p.image} alt={p.name} className="food-img" />
              <h3>{p.name}</h3>
              <p>{p.desc}</p>

              <div className="qty-control">
                <button
                  onClick={() =>
                    setPickerQty((q) => ({
                      ...q,
                      [p.id]: Math.max(1, (q[p.id] || 1) - 1),
                    }))
                  }
                >
                  -
                </button>
                <span>{pickerQty[p.id] || 1}</span>
                <button
                  onClick={() =>
                    setPickerQty((q) => ({
                      ...q,
                      [p.id]: (q[p.id] || 1) + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>

              <button className="buy-btn" onClick={() => addToCart(p.id)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Icon (bottom-right) */}
      <button className="floating-cart" onClick={() => setCartOpen(true)}>
        <span className="cart-icon">🛒</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="modal-backdrop" onClick={() => setCartOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Your cart</h3>
              <button className="x" onClick={() => setCartOpen(false)}>
                ✕
              </button>
            </div>

            {cartLines.length === 0 ? (
              <p className="empty">Cart is empty.</p>
            ) : (
              <div className="cart-list">
                {cartLines.map((line) => (
                  <div className="cart-line" key={line.id}>
                    <div>
                      <div className="cart-name">{line.name}</div>
                      <div className="cart-qty">Qty: {line.qty}</div>
                    </div>
                    <button className="mini" onClick={() => removeFromCart(line.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="buy-btn secondary" onClick={clearCart}>
                Clear cart
              </button>
              <button className="buy-btn" onClick={checkout}>
                Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
