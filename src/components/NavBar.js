import React from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

const NavBar = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        SpeeDial
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
