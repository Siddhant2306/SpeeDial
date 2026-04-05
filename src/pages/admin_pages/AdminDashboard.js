import React, { useState, useRef } from "react"; // ✅ CHANGED
import "./AdminDashboard.css";

const icons = {
  Home: "🏠",
  BarChart3: "📊",
  Package: "📦",
  BadgePercent: "🏷️",
  Boxes: "🧱",
  ShoppingBag: "🛍️",
  DollarSign: "💰",
  Users: "👥",
  Mail: "✉️",
  Settings: "⚙️",
  Search: "🔍",
  CalendarDays: "📅",
  ChevronRight: "➡️",
};

const AdminDashboard = () => {
  const [date, setDate] = useState("");        // ✅ ADDED
  const dateInputRef = useRef(null);           // ✅ ADDED

  const menuItems = [
    { label: "Dashboard", icon: icons.Home, active: true },
    { label: "Analytics", icon: icons.BarChart3 },
    { label: "Products", icon: icons.Package },
    { label: "Offers", icon: icons.BadgePercent },
    { label: "Inventory", icon: icons.Boxes },
    { label: "Orders", icon: icons.ShoppingBag },
    { label: "Sales", icon: icons.DollarSign },
    { label: "Customer", icon: icons.Users },
    { label: "Newsletter", icon: icons.Mail },
    { label: "Settings", icon: icons.Settings },
  ];

  const stats = [
    {
      title: "Total Revenue",
      subtitle: "Last 30 days",
      value: "$82,650",
      change: "11%",
      positive: true,
      icon: icons.DollarSign,
    },
    {
      title: "Total Order",
      subtitle: "Last 30 days",
      value: "1645",
      change: "11%",
      positive: true,
      icon: icons.ShoppingBag,
    },
    {
      title: "Total Customer",
      subtitle: "Last 30 days",
      value: "1,462",
      change: "17%",
      positive: false,
      icon: icons.Users,
    },
    {
      title: "Pending Delivery",
      subtitle: "Last 30 days",
      value: "110",
      change: "6%",
      positive: true,
      icon: icons.Package,
    },
  ];

  const products = [
    {
      name: "Air Jordan 8",
      pcs: "752 Pcs",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    },
    {
      name: "Air Jordan 5",
      pcs: "752 Pcs",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400",
    },
    {
      name: "Air Jordan 13",
      pcs: "752 Pcs",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    },
    {
      name: "Nike Air Max",
      pcs: "752 Pcs",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <div className="logo-mark">SD</div>
            <div>
              <h2>⚡SPEEDIAL</h2>
            </div>
          </div>

          <nav className="admin-nav">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`admin-nav-item ${item.active ? "active" : ""}`}
                type="button"
              >
                <span className="admin-nav-left">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {item.active && <span>{icons.ChevronRight}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <h1>Overview</h1>

            <div className="topbar-actions">
              <div className="search-box">
                <span>{icons.Search}</span>
                <input type="text" placeholder="Search..." />
              </div>

              {/* ✅ WORKING CALENDAR */}
              <div
                className="date-btn"
                onClick={() => {
                  if (dateInputRef.current?.showPicker) {
                    dateInputRef.current.showPicker();
                  } else {
                    dateInputRef.current?.click();
                  }
                }}
              >
                <span>{icons.CalendarDays}</span>

                <span>
                  {date
                    ? new Date(date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "30 Jul 2023"}
                </span>

                <input
                  ref={dateInputRef}
                  type="date"
                  className="date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </header>

          <section className="stats-grid">
            {stats.map((item) => (
              <div className="stat-card" key={item.title}>
                <div className="stat-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="stat-icon">{item.icon}</div>
                </div>

                <div className="stat-bottom">
                  <h2>{item.value}</h2>
                  <span className={item.positive ? "up" : "down"}>
                    {item.positive ? "↗" : "↘"} {item.change}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="middle-grid">
            <div className="panel sales-panel">
              <div className="panel-header">
                <h2>Sales Analytic</h2>
                <select>
                  <option>Jul 2023</option>
                  <option>Aug 2023</option>
                </select>
              </div>

              <div className="analytic-summary">
                <div>
                  <p>Income</p>
                  <h3>23,262.00</h3>
                </div>
                <div>
                  <p>Expenses</p>
                  <h3>11,135.00</h3>
                </div>
                <div>
                  <p>Balance</p>
                  <h3>48,135.00</h3>
                </div>
              </div>

              <div className="chart-area">
                <div className="fake-chart-line"></div>
              </div>
            </div>

            <div className="panel target-panel">
              <h2>Sales Target</h2>

              <div className="target-circle">
                <div className="target-inner">75%</div>
              </div>

              <div className="target-stats">
                <div>
                  <p>Daily Target</p>
                  <h3>650</h3>
                </div>
                <div>
                  <p>Monthly Target</p>
                  <h3>145,00</h3>
                </div>
              </div>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel products-panel">
              <div className="panel-header">
                <h2>Top Selling Products</h2>
                <div className="small-arrows">← →</div>
              </div>

              <div className="product-row">
                {products.map((product) => (
                  <div className="product-card" key={product.name}>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <h4>{product.name}</h4>
                    <p>{product.pcs}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel offer-panel">
              <h2>Current Offers</h2>

              <div className="offer-item">
                <p>40% Discount</p>
                <div className="offer-bar">
                  <span style={{ width: "40%" }}></span>
                </div>
              </div>

              <div className="offer-item">
                <p>100 Taka Coupon</p>
                <div className="offer-bar">
                  <span style={{ width: "70%" }}></span>
                </div>
              </div>

              <div className="offer-item">
                <p>Stock Out Sell</p>
                <div className="offer-bar">
                  <span style={{ width: "55%" }}></span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;