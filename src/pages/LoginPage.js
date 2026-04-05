import React, { useState } from "react";
import "../css/login.css";
import { loginUser, registerUser } from "../api/userauth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const safeName = name.trim();
      const safeEmail = email.trim().toLowerCase();
      const safePassword = password.trim();

      let response;
      let userData;

      if (mode === "signup") {
        response = await registerUser({
          name: safeName,
          email: safeEmail,
          password: safePassword,
        });

        userData = response.user;

        localStorage.setItem("user", JSON.stringify(userData));

        alert("✅ Account created successfully");
      } else {
        response = await loginUser({
          email: safeEmail,
          password: safePassword,
        });

        userData = response.user;

        localStorage.setItem("user", JSON.stringify(userData));

        alert("✅ Logged in successfully");
      }

      setName("");
      setEmail("");
      setPassword("");

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(`❌ ${err.response?.data?.message || err.message}`);
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
            ? "Create your account"
            : "Login with your registered account"}
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
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
          </button>
        </form>

        <button
          type="button"
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