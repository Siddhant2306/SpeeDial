import React, { useState, useEffect } from "react";
import "../css/login.css";
// import { adminLogin } from "../api/admin"; // optional

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate captcha
  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let cap = "";
    for (let i = 0; i < 6; i++) {
      cap += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(cap);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

   try {
  const safeEmail = email.trim().toLowerCase();
  const safeUsername = username.trim();

  // CAPTCHA check
  if (captchaInput !== captcha) {
    throw new Error("Captcha does not match");
  }

  // 👉 Use safeEmail here (FIX)
  alert(`✅ Admin Logged in (${safeUsername}, ${safeEmail})`);

  setPassword("");
  setCaptchaInput("");
  generateCaptcha();

} catch (err) {
  alert(`❌ ${err.message}`);
  generateCaptcha();
} finally {
  setLoading(false);
}
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="muted">Login as administrator</p>

        <form onSubmit={submit} className="login-form">
          <label>
            Admin Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin123"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {/* CAPTCHA */}
          <div className="captcha-box">
            <div className="captcha">{captcha}</div>
            <button type="button" onClick={generateCaptcha}>
              ↻
            </button>
          </div>

          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter Captcha"
            required
          />

          <button className="primary" disabled={loading}>
            {loading ? "Please wait…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;