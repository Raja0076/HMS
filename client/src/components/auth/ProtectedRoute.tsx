import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import Spinner from "../common/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <Spinner className="min-h-screen" size="lg" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && (!user?.role || !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;