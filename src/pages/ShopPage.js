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
        <feDropShadow dx="0" dy="18" stdDeviation="25" flood-color="#000" flood-opacity="0.45" />
      </filter>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <circle cx="980" cy="220" r="220" fill="rgba(255,255,255,0.18)"/>
    <circle cx="260" cy="640" r="260" fill="rgba(0,0,0,0.10)"/>
    <g filter="url(#s)">
      <rect x="90" y="120" width="1020" height="560" rx="44" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.20)" />
    </g>
    <text x="150" y="330" font-size="120" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${emoji}</text>
    <text x="150" y="440" font-size="72" font-weight="900" font-family="Inter, Arial" fill="rgba(255,255,255,0.96)">${title}</text>
    <text x="150" y="520" font-size="34" font-weight="800" font-family="Inter, Arial" fill="rgba(255,255,255,0.84)">SpeeDial</text>
  </svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

const PRODUCTS = [
  // Chips (multiple flavors)
  {
    id: "chips-classic-salt",
    name: "Chips • Classic Salt",
    desc: "Simple, crispy, and perfectly salted.",
    type: "snack",
    category: "chips",
    image: makeSvgDataUri({ bg1: "#fbbf24", bg2: "#f97316", title: "Classic", emoji: "🥔" }),
  },
  {
    id: "chips-masala",
    name: "Chips • Masala",
    desc: "Spicy desi masala punch.",
    type: "snack",
    category: "chips",
    image: makeSvgDataUri({ bg1: "#fb7185", bg2: "#ef4444", title: "Masala", emoji: "🌶️" }),
  },
  {
    id: "chips-bbq",
    name: "Chips • BBQ",
    desc: "Smoky BBQ flavor with a crunch.",
    type: "snack",
    category: "chips",
    image: makeSvgDataUri({ bg1: "#a78bfa", bg2: "#8b5cf6", title: "BBQ", emoji: "🔥" }),
  },
  {
    id: "chips-cheese",
    name: "Chips • Cheese",
    desc: "Cheesy, creamy, dangerously addictive.",
    type: "snack",
    category: "chips",
    image: makeSvgDataUri({ bg1: "#fde047", bg2: "#f59e0b", title: "Cheese", emoji: "🧀" }),
  },
  {
    id: "chips-sour-cream",
    name: "Chips • Sour Cream",
    desc: "Tangy sour cream & onion vibes.",
    type: "snack",
    category: "chips",
    image: makeSvgDataUri({ bg1: "#22d3ee", bg2: "#3b82f6", title: "Sour", emoji: "🧅" }),
  },

  // Other snacks
  {
    id: "nachos",
    name: "Cheesy Nachos",
    desc: "Loaded nachos with a cheesy kick.",
    type: "snack",
    category: "snacks",
    image: makeSvgDataUri({ bg1: "#f72585", bg2: "#7209b7", title: "Nachos", emoji: "🧀" }),
  },
  {
    id: "cookies",
    name: "Choco Cookies",
    desc: "Soft cookies with chocolate chunks.",
    type: "snack",
    category: "snacks",
    image: makeSvgDataUri({ bg1: "#b08968", bg2: "#7f5539", title: "Cookies", emoji: "🍪" }),
  },

  // Drinks
  {
    id: "cola",
    name: "Cola",
    desc: "Ice-cold fizzy refreshment.",
    type: "drink",
    category: "drinks",
    image: makeSvgDataUri({ bg1: "#111827", bg2: "#ef4444", title: "Cola", emoji: "🥤" }),
  },
  {
    id: "lemonade",
    name: "Lemonade",
    desc: "Fresh and tangy.",
    type: "drink",
    category: "drinks",
    image: makeSvgDataUri({ bg1: "#34d399", bg2: "#f59e0b", title: "Lemonade", emoji: "🍋" }),
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    desc: "Sweet, chilled, and smooth.",
    type: "drink",
    category: "drinks",
    image: makeSvgDataUri({ bg1: "#06b6d4", bg2: "#2563eb", title: "Iced Tea", emoji: "🧊" }),
  },
];

const QtyControl = ({ value, onDec, onInc }) => {
  return (
    <div className="qty-control">
      <button onClick={onDec}>-</button>
      <span>{value}</span>
      <button onClick={onInc}>+</button>
    </div>
  );
};

const ProductCard = ({ p, pickerQty, setPickerQty, addToCart }) => {
  const qty = pickerQty[p.id] || 1;

  return (
    <div className="product" key={p.id}>
      <div className="product-media">
        <img src={p.image} alt={p.name} />
      </div>

      <div className="product-body">
        <div className="product-title">{p.name}</div>
        <div className="product-desc">{p.desc}</div>

        <div className="product-row">
          <QtyControl
            value={qty}
            onDec={() =>
              setPickerQty((q) => ({
                ...q,
                [p.id]: Math.max(1, (q[p.id] || 1) - 1),
              }))
            }
            onInc={() =>
              setPickerQty((q) => ({
                ...q,
                [p.id]: (q[p.id] || 1) + 1,
              }))
            }
          />

          <button className="neon-btn" onClick={() => addToCart(p.id)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [pickerQty, setPickerQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  );
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

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

  const q = query.trim().toLowerCase();

  const filtered = PRODUCTS.filter((p) => {
    const key = p.category || p.type;
    const matchesTab = activeTab === "all" ? true : key === activeTab;
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  const chips = filtered.filter((p) => p.category === "chips");
  const snacks = filtered.filter((p) => p.type === "snack" && p.category !== "chips");
  const drinks = filtered.filter((p) => p.type === "drink");

  const cartLines = Object.entries(cart).map(([productId, qty]) => {
    const p = PRODUCTS.find((x) => x.id === productId);
    return { id: productId, name: p?.name || productId, qty };
  });

  return (
    <div className="shop2">
      <div className="shop2-inner">
        <div className="hero2">
          <div>
            <div className="pill2">Dark Neon</div>
            <div className="hero2-title">SpeeDial Store</div>
            <div className="hero2-sub">Tap add. Open cart. Place one order.</div>

            <div className="controls2">
              <div className="tabs2">
                {[
                  { id: "all", label: "All" },
                  { id: "chips", label: "Chips" },
                  { id: "snacks", label: "Snacks" },
                  { id: "drinks", label: "Drinks" },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={"tab2 " + (activeTab === t.id ? "active" : "")}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="search2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search… (masala, cola, chips)"
                />
              </div>
            </div>
          </div>

          <div className="stat2">
            <div className="stat2-num">{cartCount}</div>
            <div className="stat2-label">in cart</div>
          </div>
        </div>

        {chips.length > 0 && (
          <>
            <div className="section2">Chips</div>
            <div className="grid2">
              {chips.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  pickerQty={pickerQty}
                  setPickerQty={setPickerQty}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}

        {snacks.length > 0 && (
          <>
            <div className="section2">Snacks</div>
            <div className="grid2">
              {snacks.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  pickerQty={pickerQty}
                  setPickerQty={setPickerQty}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}

        {drinks.length > 0 && (
          <>
            <div className="section2">Drinks</div>
            <div className="grid2">
              {drinks.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  pickerQty={pickerQty}
                  setPickerQty={setPickerQty}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}

        {chips.length === 0 && snacks.length === 0 && drinks.length === 0 && (
          <div className="empty2">No items match your search.</div>
        )}
      </div>

      <button className="cartFab" onClick={() => setCartOpen(true)}>
        <span className="cartFabIcon">🛒</span>
        {cartCount > 0 && <span className="cartFabBadge">{cartCount}</span>}
      </button>

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
