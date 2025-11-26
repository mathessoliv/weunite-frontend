import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";
import { ReportedPostsPage } from "@/pages/admin/ReportedPostsPage";
import { ReportedOpportunitiesPage } from "@/pages/admin/ReportedOpportunitiesPage";

function AdminProtectedRoutes() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Corrigido: comparação de role deve ser case-insensitive
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminProtectedRoutes />}>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/users" element={<AdminUsersPage />} />
        <Route path="/reports" element={<AdminReportsPage />} />
        <Route path="/posts/reported" element={<ReportedPostsPage />} />
        <Route
          path="/opportunities/reported"
          element={<ReportedOpportunitiesPage />}
        />
      </Route>
    </Routes>
  );
}
