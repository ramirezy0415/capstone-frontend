import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { Outlet } from "react-router";

export default function ProtectedRoute() {
  const { token } = useAuth();

  // If no token, send them to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return <Outlet />;
}
