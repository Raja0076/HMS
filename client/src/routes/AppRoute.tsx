import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute    from "../components/auth/ProtectedRoute";
import DashboardLayout   from "../components/layout/DashboardLayout";

import LoginPage         from "../pages/auth/LoginPage";
import RegisterPage      from "../pages/auth/RegisterPage";
import UnauthorizedPage  from "../pages/UnauthorizedPage";

import AdminDashboard    from "../pages/dashboard/AdminDashboard";
import StaffDashboard    from "../pages/dashboard/StaffDashboard";
import ResidentDashboard from "../pages/dashboard/ResidentDashboard";

const AppRoute = () => (
  <Routes>
    {/* Public */}
    <Route path="/login"        element={<LoginPage />} />
    <Route path="/register"     element={<RegisterPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    {/* Admin */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["admin"]}>
          <DashboardLayout title="Admin Panel" />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
    </Route>

    {/* Staff */}
    <Route
      path="/staff"
      element={
        <ProtectedRoute roles={["staff"]}>
          <DashboardLayout title="Staff Panel" />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<StaffDashboard />} />
    </Route>

    {/* Resident */}
    <Route
      path="/resident"
      element={
        <ProtectedRoute roles={["resident"]}>
          <DashboardLayout title="Resident Portal" />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<ResidentDashboard />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoute;