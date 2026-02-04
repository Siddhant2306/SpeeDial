import "./App.css";
import NavBar from "./components/NavBar";
import FoodCards from "./components/FoodCard";
import LoginPage from "./pages/LoginPage";
import FloatingLoginButton from "./components/FloatingLoginButton";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <FoodCards />
              <NavBar />
              <FloatingLoginButton />
            </div>
          }
        />
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
