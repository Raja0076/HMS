import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import Spinner from "../common/Spinner";

// roles: array of allowed roles e.g. ["admin"] or ["admin", "staff"]
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <Spinner className="min-h-screen" size="lg" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;