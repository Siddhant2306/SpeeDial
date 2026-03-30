import React from "react";

const DEFAULT_TABS = [
  { id: "all", label: "All" },
  { id: "chips", label: "Chips" },
  { id: "snacks", label: "Snacks" },
  { id: "drinks", label: "Drinks" },
  { id: "sweets", label: "Sweets" },
];

const ShopHero = ({ tabs = DEFAULT_TABS, activeTab, onTabChange, query, onQueryChange, cartCount }) => {
  return (
    <div className="hero2">
      <div>
        <div className="pill2">Dark Neon</div>
        <div className="hero2-title">SpeeDial Store</div>
        <div className="hero2-sub">Browse products from your database.</div>

        <div className="controls2">
          <div className="tabs2">
            {tabs.map((t) => (
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
              placeholder="Search… (name, brand, category)"
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

