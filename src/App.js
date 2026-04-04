import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import FloatingLoginButton from "./components/FloatingLoginButton";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "dark";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <NavBar theme={theme} setTheme={setTheme} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />

        <Route
          path="/login"
          element={
            <div>
              <LoginPage />
              <FloatingLoginButton />
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <div>
              <AdminLoginPage />
            </div>
          }
        />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;