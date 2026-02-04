import React from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import ThemeToggle from "./ThemeToggle";

const NavBar = ({ theme, setTheme }) => {
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
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default NavBar;
