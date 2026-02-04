import "./App.css";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import FloatingLoginButton from "./components/FloatingLoginButton";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
