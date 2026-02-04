import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/floating-login-button.css";

const FloatingLoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onLoginPage = location.pathname === "/login";

  return (
    <button
      className="floating-login"
      onClick={() => navigate(onLoginPage ? "/" : "/login")}
      aria-label={onLoginPage ? "Go Home" : "Open Login"}
      title={onLoginPage ? "Home" : "Login"}
    >
      {onLoginPage ? "Home" : "Login"}
    </button>
  );
};

export default FloatingLoginButton;
