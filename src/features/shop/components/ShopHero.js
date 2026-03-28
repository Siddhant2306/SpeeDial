import React from "react";

const TABS = [
  { id: "all", label: "All" },
  { id: "chips", label: "Chips" },
  { id: "snacks", label: "Snacks" },
  { id: "drinks", label: "Drinks" },
];

const ShopHero = ({ activeTab, onTabChange, query, onQueryChange, cartCount }) => {
  return (
    <div className="hero2">
      <div>
        <div className="pill2">Dark Neon</div>
        <div className="hero2-title">SpeeDial Store</div>
        <div className="hero2-sub">Tap add. Open cart. Place one order.</div>

        <div className="controls2">
          <div className="tabs2">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={"tab2" + (activeTab === t.id ? " active" : "")}
                onClick={() => onTabChange(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="search2">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
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
  );
};

export default ShopHero;

