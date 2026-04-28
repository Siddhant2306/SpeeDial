import React, { useRef, useState, useEffect } from "react";
import "./AdminDashboard.css";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

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

const pageData = {
  Dashboard: {
    title: "Overview",
    cards: [
      { title: "Total Revenue", sub: "Last 30 days", value: "₹82,650", icon: "💰", change: "11%", up: true },
      { title: "Total Order", sub: "Last 30 days", value: "1645", icon: "🛍️", change: "11%", up: true },
      { title: "Total Customer", sub: "Last 30 days", value: "1,462", icon: "👥", change: "17%", up: false },
      { title: "Pending Delivery", sub: "Last 30 days", value: "110", icon: "📦", change: "6%", up: true },
    ],
    mainTitle: "Sales Analytic",
    summary: [
      { label: "Income", value: "23,262.00" },
      { label: "Expenses", value: "11,135.00" },
      { label: "Balance", value: "48,135.00" },
    ],
    sideTitle: "Sales Target",
    sideStats: [
      { label: "Daily Target", value: "650" },
      { label: "Monthly Target", value: "145,00" },
    ],
    tableTitle: "Top Selling Products",
    tableHeaders: ["Product", "Orders", "Revenue"],
    tableRows: [
      ["Chips", "220", "₹6,600"],
      ["Cold Drinks", "180", "₹7,800"],
      ["Biscuits", "150", "₹4,500"],
    ],
    progressTitle: "Current Offers",
    progress: [
      { label: "40% Discount", value: "40%" },
      { label: "₹100 Coupon", value: "70%" },
      { label: "Stock Out Sell", value: "55%" },
    ],
  },
};

const menuItems = [
  { label: "Dashboard", icon: icons.Home },
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

const AdminDashboard = () => {
  const [date, setDate] = useState(getTodayDate);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const dateInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(getTodayDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const current = pageData[activeMenu] || pageData["Dashboard"];

  return (
    <div className="admin-page">
      <div className="admin-shell">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <div className="logo-mark">SD</div>
            <h2>⚡ SPEEDIAL</h2>
          </div>

          <nav className="admin-nav">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`admin-nav-item ${activeMenu === item.label ? "active" : ""}`}
                onClick={() => setActiveMenu(item.label)}
              >
                <span className="admin-nav-left">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {activeMenu === item.label && <span>{icons.ChevronRight}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="admin-main">

          <header className="admin-topbar">
            <h1>{current.title}</h1>

            <div className="topbar-actions">

              <div className="search-box">
                <span>{icons.Search}</span>
                <input type="text" placeholder="Search..." />
              </div>

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
                  {new Date(date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
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

          {/* STATS */}
          <section className="stats-grid">
            {current.cards.map((card) => (
              <div className="stat-card" key={card.title}>
                <div className="stat-top">
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.sub}</p>
                  </div>
                  <div className="stat-icon">{card.icon}</div>
                </div>

                <div className="stat-bottom">
                  <h2>{card.value}</h2>
                  <span className={card.up ? "up" : "down"}>
                    {card.up ? "↗" : "↘"} {card.change}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* MIDDLE */}
          <section className="middle-grid">
            <div className="panel sales-panel">
              <div className="panel-header">
                <h2>{current.mainTitle}</h2>
              </div>

              <div className="analytic-summary">
                {current.summary.map((item) => (
                  <div key={item.label}>
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                  </div>
                ))}
              </div>

              <div className="chart-area">
                <div className="fake-chart-line"></div>
              </div>
            </div>

            <div className="panel target-panel">
              <h2>{current.sideTitle}</h2>

              <div className="target-stats">
                {current.sideStats.map((item) => (
                  <div key={item.label}>
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BOTTOM */}
          <section className="bottom-grid">
            <div className="panel products-panel">
              <h2>{current.tableTitle}</h2>

              <div className="analytics-table">
                <table>
                  <thead>
                    <tr>
                      {current.tableHeaders.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {current.tableRows.map((row, i) => (
                      <tr key={i}>
                        {row.map((col, j) => (
                          <td key={j}>{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel offer-panel">
              <h2>{current.progressTitle}</h2>

              {current.progress.map((p) => (
                <div className="offer-item" key={p.label}>
                  <p>{p.label}</p>
                  <div className="offer-bar">
                    <span style={{ width: p.value }}></span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;