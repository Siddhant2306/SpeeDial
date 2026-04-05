import "./App.css";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import FloatingLoginButton from "./components/FloatingLoginButton";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "dark";
  });

  const UserLayout = () => (
    <>
      <NavBar theme={theme} setTheme={setTheme} />
      <Outlet />
    </>
  );

  const AdminLayout = () => (
    <>
      <Outlet />
    </>
  );

  const AdminProtectedRoute = ({ children }) => {
    const isAdminLoggedIn = false; // TODO: Replace with actual authentication logic
    return isAdminLoggedIn ? children : <Navigate to="/admin" />;
  };

  // ✅ user protected route for login page
  const UserAuthRoute = ({ children }) => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? <Navigate to="/" /> : children;
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />

            <Route
              path="/login"
              element={
                <UserAuthRoute>
                  <>
                    <LoginPage />
                    <FloatingLoginButton />
                  </>
                </UserAuthRoute>
              }
            />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminLoginPage />} />
            <Route
              path="dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;