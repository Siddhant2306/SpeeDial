import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  return isAdminLoggedIn ? children : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;