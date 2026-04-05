import React, { useState } from "react";
import "../css/login.css";
import { loginUser, registerUser } from "../api/userauth";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const safeName = name.trim();
      const safeEmail = email.trim().toLowerCase();

      const data =
        mode === "signup"
          ? await registerUser({ name: safeName, email: safeEmail, password })
          : await loginUser({ email: safeEmail, password });

      alert(
        mode === "signup"
          ? `✅ Account created (user id: ${data.user_id})`
          : `✅ Logged in (user id: ${data.user_id})`
      );
      setPassword("");
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>{mode === "signup" ? "Create account" : "Login"}</h2>
        <p className="muted">
          {mode === "signup"
            ? "Sign up to save your user in MySQL"
            : "Login using the user saved in MySQL"}
        </p>

        <form onSubmit={submit} className="login-form">
          {mode === "signup" && (
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Akshit Singh"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              minLength={6}
              required
            />
          </label>

          <button className="primary" disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Login"}
          </button>
        </form>

        <button
          className="linkish"
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
