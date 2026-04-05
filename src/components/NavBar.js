import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import ThemeToggle from "./ThemeToggle";

const NavBar = ({ theme, setTheme }) => {
  const [user, setUser] = useState(null);

  // 🔥 Check login status
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo">
        SpeeDial
      </Link>

      <div className="nav-right">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/shop">Shop</Link>
            </li>

            {/* 🔥 CONDITIONAL LOGIN / PROFILE */}
            <li>
              {user ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Profile"
                  className="nav-profile-icon"
                />
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>

        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default NavBar;