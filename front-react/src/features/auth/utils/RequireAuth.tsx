import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RequireAuth = () => {
  const { isAuthetificated } = useAuth();
  const location = useLocation();

  if (!isAuthetificated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
