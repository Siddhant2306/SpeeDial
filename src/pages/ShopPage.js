import React, { useMemo, useState } from "react";
import "../css/shop.css";

const makeSvgDataUri = ({ bg1, bg2, title, emoji }) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bg1}"/>
        <stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="25" flood-color="#000" flood-opacity="0.35" />
      </filter>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="980" cy="220" r="220" fill="rgba(255,255,255,0.20)"/>
    <circle cx="260" cy="640" r="260" fill="rgba(0,0,0,0.08)"/>
    <g filter="url(#s)">
      <rect x="90" y="120" width="1020" height="560" rx="44" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.22)" />
    </g>
    <text x="150" y="330" font-size="120" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${emoji}</text>
    <text x="150" y="440" font-size="72" font-weight="800" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${title}</text>
    <text x="150" y="520" font-size="34" font-weight="700" font-family="Inter, Arial" fill="rgba(255,255,255,0.86)">SpeeDial</text>
  </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

const PRODUCTS = [
  // Snacks
  {
    id: "chips",
    name: "Classic Chips",
    desc: "Crispy salted chips for the perfect crunch.",
    type: "snack",
    image: makeSvgDataUri({ bg1: "#ffb703", bg2: "#fb8500", title: "Chips", emoji: "🥔" }),
  },
  {
    id: "nachos",
    name: "Cheesy Nachos",
    desc: "Loaded nachos with a cheesy kick.",
    type: "snack",
    image: makeSvgDataUri({ bg1: "#f72585", bg2: "#7209b7", title: "Nachos", emoji: "🧀" }),
  },
  {
    id: "cookies",
    name: "Choco Cookies",
    desc: "Soft cookies with chocolate chunks.",
    type: "snack",
    image: makeSvgDataUri({ bg1: "#b08968", bg2: "#7f5539", title: "Cookies", emoji: "🍪" }),
  },

  // Drinks
  {
    id: "cola",
    name: "Cola",
    desc: "Ice-cold fizzy refreshment.",
    type: "drink",
    image: makeSvgDataUri({ bg1: "#111827", bg2: "#ef4444", title: "Cola", emoji: "🥤" }),
  },
  {
    id: "lemonade",
    name: "Lemonade",
    desc: "Fresh and tangy.",
    type: "drink",
    image: makeSvgDataUri({ bg1: "#34d399", bg2: "#f59e0b", title: "Lemonade", emoji: "🍋" }),
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    desc: "Sweet, chilled, and smooth.",
    type: "drink",
    image: makeSvgDataUri({ bg1: "#06b6d4", bg2: "#2563eb", title: "Iced Tea", emoji: "🧊" }),
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
