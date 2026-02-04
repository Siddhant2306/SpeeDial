import React from "react";
import "../css/theme-toggle.css";

const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      <span className="dot" aria-hidden="true" />
      <span className="label">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;
