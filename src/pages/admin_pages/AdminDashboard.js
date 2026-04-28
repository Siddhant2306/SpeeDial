import React, { useRef, useState } from "react";
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

  Analytics: {
    title: "Analytics",
    cards: [
      { title: "Today Orders", sub: "Live order count", value: "124", icon: "📦", change: "Live", up: true },
      { title: "Today Revenue", sub: "Sales today", value: "₹8,450", icon: "💸", change: "9%", up: true },
      { title: "Active Customers", sub: "Currently active", value: "312", icon: "👥", change: "5%", up: true },
      { title: "Avg Delivery Time", sub: "Delivery speed", value: "18 min", icon: "🛵", change: "3 min", up: true },
    ],
    mainTitle: "SpeeDial Analytics",
    summary: [
      { label: "Total Orders", value: "1,248" },
      { label: "Delivered", value: "1,102" },
      { label: "Pending", value: "96" },
    ],
    sideTitle: "Category Performance",
    sideStats: [
      { label: "Snacks", value: "75%" },
      { label: "Beverages", value: "60%" },
      { label: "Dairy", value: "48%" },
    ],
    tableTitle: "Top Selling Products",
    tableHeaders: ["Product", "Orders", "Revenue"],
    tableRows: [
      ["Chips", "120", "₹3,600"],
      ["Cold Drinks", "98", "₹4,200"],
      ["Ice Cream", "64", "₹3,100"],
    ],
    progressTitle: "Backend Connection",
    progress: [
      { label: "Orders Analytics API", value: "90%" },
      { label: "Revenue Analytics API", value: "80%" },
      { label: "Customer Analytics API", value: "70%" },
    ],
  },

  Products: {
    title: "Products",
    cards: [
      { title: "Total Products", sub: "All items", value: "248", icon: "📦", change: "12 new", up: true },
      { title: "Best Seller", sub: "Most ordered", value: "Chips", icon: "🍟", change: "High", up: true },
      { title: "Low Stock", sub: "Need refill", value: "18", icon: "⚠️", change: "Alert", up: false },
      { title: "Categories", sub: "Active groups", value: "6", icon: "🧃", change: "Stable", up: true },
    ],
    mainTitle: "Product Analytics",
    summary: [
      { label: "Snacks", value: "96" },
      { label: "Drinks", value: "72" },
      { label: "Sweets", value: "45" },
    ],
    sideTitle: "Stock Health",
    sideStats: [
      { label: "Available", value: "82%" },
      { label: "Low Stock", value: "12%" },
      { label: "Out of Stock", value: "6%" },
    ],
    tableTitle: "Product List",
    tableHeaders: ["Product", "Stock", "Price"],
    tableRows: [
      ["Classic Salt Chips", "120", "₹30"],
      ["Cold Drink", "86", "₹45"],
      ["Chocolate Bar", "64", "₹25"],
    ],
    progressTitle: "Category Demand",
    progress: [
      { label: "Chips", value: "78%" },
      { label: "Drinks", value: "65%" },
      { label: "Sweets", value: "45%" },
    ],
  },

  Offers: {
    title: "Offers",
    cards: [
      { title: "Active Offers", sub: "Currently running", value: "12", icon: "🏷️", change: "4 new", up: true },
      { title: "Total Discounts", sub: "This month", value: "₹18,500", icon: "💸", change: "9%", up: true },
      { title: "Offer Usage", sub: "Customers used", value: "428", icon: "🛍️", change: "16%", up: true },
      { title: "Expired Offers", sub: "Last 30 days", value: "5", icon: "⏳", change: "2", up: false },
    ],
    mainTitle: "Offers Performance",
    summary: [
      { label: "Coupon Used", value: "428" },
      { label: "Offer Reach", value: "1,920" },
      { label: "Conversion", value: "22%" },
    ],
    sideTitle: "Best Offer Types",
    sideStats: [
      { label: "Flat Discount", value: "40%" },
      { label: "Coupon Code", value: "70%" },
      { label: "Combo Offer", value: "55%" },
    ],
    tableTitle: "Running Offers",
    tableHeaders: ["Offer", "Usage", "Savings"],
    tableRows: [
      ["Flat 40% OFF", "182", "₹7,200"],
      ["₹100 Coupon", "146", "₹14,600"],
      ["Clearance Sale", "100", "₹5,400"],
    ],
    progressTitle: "Offer Progress",
    progress: [
      { label: "Flat 40% OFF", value: "40%" },
      { label: "₹100 Coupon", value: "70%" },
      { label: "Clearance Sale", value: "55%" },
    ],
  },

  Inventory: {
    title: "Inventory",
    cards: [
      { title: "Total Stock", sub: "Available units", value: "4,820", icon: "🧱", change: "8%", up: true },
      { title: "Low Stock", sub: "Needs refill", value: "34", icon: "⚠️", change: "Alert", up: false },
      { title: "Restocked Items", sub: "This week", value: "82", icon: "🔄", change: "12%", up: true },
      { title: "Out of Stock", sub: "Unavailable", value: "11", icon: "❌", change: "5", up: false },
    ],
    mainTitle: "Inventory Flow",
    summary: [
      { label: "In Stock", value: "4,820" },
      { label: "Used", value: "1,240" },
      { label: "Restocked", value: "820" },
    ],
    sideTitle: "Inventory Status",
    sideStats: [
      { label: "Healthy", value: "74%" },
      { label: "Low", value: "18%" },
      { label: "Empty", value: "8%" },
    ],
    tableTitle: "Stock Items",
    tableHeaders: ["Item", "Quantity", "Status"],
    tableRows: [
      ["Chips", "320", "Available"],
      ["Cold Drink", "96", "Low"],
      ["Ice Cream", "0", "Out"],
    ],
    progressTitle: "Stock Levels",
    progress: [
      { label: "Snacks", value: "80%" },
      { label: "Drinks", value: "55%" },
      { label: "Dairy", value: "30%" },
    ],
  },

  Orders: {
    title: "Orders",
    cards: [
      { title: "Total Orders", sub: "This month", value: "1,248", icon: "🛍️", change: "11%", up: true },
      { title: "Delivered", sub: "Completed", value: "1,102", icon: "✅", change: "8%", up: true },
      { title: "Pending", sub: "Waiting", value: "96", icon: "⏳", change: "6%", up: false },
      { title: "Cancelled", sub: "Failed orders", value: "50", icon: "❌", change: "2%", up: false },
    ],
    mainTitle: "Order Analytics",
    summary: [
      { label: "COD Orders", value: "520" },
      { label: "UPI Orders", value: "480" },
      { label: "Net Banking", value: "248" },
    ],
    sideTitle: "Order Status",
    sideStats: [
      { label: "Delivered", value: "88%" },
      { label: "Pending", value: "8%" },
      { label: "Cancelled", value: "4%" },
    ],
    tableTitle: "Recent Orders",
    tableHeaders: ["Order ID", "Customer", "Status"],
    tableRows: [
      ["#SD1021", "Rahul", "Delivered"],
      ["#SD1022", "Ananya", "Pending"],
      ["#SD1023", "Priya", "Cancelled"],
    ],
    progressTitle: "Payment Methods",
    progress: [
      { label: "COD", value: "42%" },
      { label: "UPI", value: "39%" },
      { label: "Net Banking", value: "19%" },
    ],
  },

  Sales: {
    title: "Sales",
    cards: [
      { title: "Total Sales", sub: "This month", value: "₹1,25,000", icon: "💰", change: "12%", up: true },
      { title: "Orders Completed", sub: "Delivered orders", value: "1,102", icon: "📦", change: "8%", up: true },
      { title: "Refunds", sub: "Returned orders", value: "₹4,200", icon: "🔄", change: "2%", up: false },
      { title: "Net Profit", sub: "After expenses", value: "₹78,500", icon: "📈", change: "10%", up: true },
    ],
    mainTitle: "Sales Overview",
    summary: [
      { label: "Daily Sales", value: "₹5,200" },
      { label: "Weekly Sales", value: "₹36,000" },
      { label: "Monthly Sales", value: "₹1,25,000" },
    ],
    sideTitle: "Sales Targets",
    sideStats: [
      { label: "Daily Target", value: "₹6,000" },
      { label: "Monthly Target", value: "₹1,50,000" },
      { label: "Achieved", value: "83%" },
    ],
    tableTitle: "Top Sales Products",
    tableHeaders: ["Product", "Units Sold", "Revenue"],
    tableRows: [
      ["Chips", "220", "₹6,600"],
      ["Cold Drinks", "180", "₹7,800"],
      ["Biscuits", "150", "₹4,500"],
    ],
    progressTitle: "Sales Growth",
    progress: [
      { label: "Week 1", value: "60%" },
      { label: "Week 2", value: "75%" },
      { label: "Week 3", value: "90%" },
    ],
  },

  Customer: {
    title: "Customer",
    cards: [
      { title: "Total Customers", sub: "Registered users", value: "1,462", icon: "👥", change: "17%", up: true },
      { title: "New Customers", sub: "This month", value: "184", icon: "🆕", change: "11%", up: true },
      { title: "Repeat Buyers", sub: "Returning users", value: "628", icon: "🔁", change: "9%", up: true },
      { title: "Rating", sub: "Satisfaction", value: "4.8/5", icon: "⭐", change: "3%", up: true },
    ],
    mainTitle: "Customer Insights",
    summary: [
      { label: "Active Customers", value: "312" },
      { label: "Avg Orders/User", value: "3.4" },
      { label: "Retention Rate", value: "68%" },
    ],
    sideTitle: "Customer Segments",
    sideStats: [
      { label: "New Users", value: "22%" },
      { label: "Regular Buyers", value: "43%" },
      { label: "Premium Users", value: "35%" },
    ],
    tableTitle: "Top Customers",
    tableHeaders: ["Customer", "Orders", "Spent"],
    tableRows: [
      ["Rahul Sharma", "28", "₹12,400"],
      ["Ananya Gupta", "21", "₹9,850"],
      ["Priya Singh", "19", "₹8,920"],
    ],
    progressTitle: "Customer Growth",
    progress: [
      { label: "New Signups", value: "65%" },
      { label: "Repeat Orders", value: "78%" },
      { label: "Loyalty Members", value: "52%" },
    ],
  },

  Newsletter: {
    title: "Newsletter",
    cards: [
      { title: "Subscribers", sub: "Total users", value: "2,420", icon: "✉️", change: "14%", up: true },
      { title: "Emails Sent", sub: "This month", value: "8,900", icon: "📨", change: "20%", up: true },
      { title: "Open Rate", sub: "User engagement", value: "62%", icon: "📬", change: "5%", up: true },
      { title: "Unsubscribed", sub: "This month", value: "32", icon: "📭", change: "2%", up: false },
    ],
    mainTitle: "Newsletter Analytics",
    summary: [
      { label: "Campaigns", value: "12" },
      { label: "Opened", value: "5,518" },
      { label: "Clicked", value: "1,280" },
    ],
    sideTitle: "Campaign Status",
    sideStats: [
      { label: "Success", value: "76%" },
      { label: "Pending", value: "18%" },
      { label: "Failed", value: "6%" },
    ],
    tableTitle: "Recent Campaigns",
    tableHeaders: ["Campaign", "Open Rate", "Clicks"],
    tableRows: [
      ["Weekend Snacks", "68%", "420"],
      ["Cold Drink Offer", "59%", "310"],
      ["Flash Sale", "72%", "550"],
    ],
    progressTitle: "Campaign Reach",
    progress: [
      { label: "Email", value: "80%" },
      { label: "SMS", value: "45%" },
      { label: "App Alert", value: "70%" },
    ],
  },

  Settings: {
    title: "Settings",
    cards: [
      { title: "Admin Profile", sub: "Account status", value: "Active", icon: "⚙️", change: "OK", up: true },
      { title: "Security", sub: "Login protection", value: "Enabled", icon: "🔐", change: "Safe", up: true },
      { title: "Theme", sub: "Current mode", value: "Dark", icon: "🎨", change: "Custom", up: true },
      { title: "Backend", sub: "API status", value: "Ready", icon: "🧩", change: "Connect", up: true },
    ],
    mainTitle: "System Settings",
    summary: [
      { label: "Admin Access", value: "Enabled" },
      { label: "API Mode", value: "Localhost" },
      { label: "Database", value: "MySQL" },
    ],
    sideTitle: "Configuration",
    sideStats: [
      { label: "Frontend", value: "React" },
      { label: "Backend", value: "Flask" },
      { label: "Database", value: "MySQL" },
    ],
    tableTitle: "Settings Options",
    tableHeaders: ["Setting", "Status", "Action"],
    tableRows: [
      ["Profile", "Active", "Edit"],
      ["Password", "Protected", "Change"],
      ["Backend API", "Ready", "Connect"],
    ],
    progressTitle: "System Health",
    progress: [
      { label: "Frontend", value: "90%" },
      { label: "Backend", value: "80%" },
      { label: "Database", value: "75%" },
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
  const [date, setDate] = useState("");
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const dateInputRef = useRef(null);

  const current = pageData[activeMenu];

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <div className="logo-mark">SD</div>
            <h2>⚡ SPEEDIAL</h2>
          </div>

          <nav className="admin-nav">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`admin-nav-item ${
                  activeMenu === item.label ? "active" : ""
                }`}
                type="button"
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

          <section className="middle-grid">
            <div className="panel sales-panel">
              <div className="panel-header">
                <h2>{current.mainTitle}</h2>
                <select>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Week</option>
                </select>
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

              <div className="target-circle">
                <div className="target-inner">75%</div>
              </div>

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

          <section className="bottom-grid">
            <div className="panel products-panel">
              <div className="panel-header">
                <h2>{current.tableTitle}</h2>
              </div>

              <div className="analytics-table">
                <table>
                  <thead>
                    <tr>
                      {current.tableHeaders.map((head) => (
                        <th key={head}>{head}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {current.tableRows.map((row, index) => (
                      <tr key={index}>
                        {row.map((col, i) => (
                          <td key={i}>{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel offer-panel">
              <h2>{current.progressTitle}</h2>

              {current.progress.map((item) => (
                <div className="offer-item" key={item.label}>
                  <p>{item.label}</p>
                  <div className="offer-bar">
                    <span style={{ width: item.value }}></span>
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