import { createHashRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/common/layout";
import { ProtectedRoute } from "./components/common/protected-route";
import { PublicRoute } from "./components/common/public-route";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminFaceSetupPage } from "./pages/admin-face-setup-page";
import { AdminLoginPage } from "./pages/admin-login-page";
import { OrganizationManagementPage } from "./pages/organization-management-page";
import { AttendanceDashboardPage } from "./pages/attendance-dashboard-page";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";

import { UserManagementPage } from "./pages/user-management-page";
import { HistoryManagementPage } from "./pages/history-management-page";
import { StatsAnalysisPage } from "./pages/stats-analysis-page";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin/login",
        element: (
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/face-setup",
        element: (
          <ProtectedRoute>
            <AdminFaceSetupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/organizations",
        element: (
          <ProtectedRoute>
            <OrganizationManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/organizations/:organizationId/attendance",
        element: (
          <ProtectedRoute>
            <AttendanceDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/history",
        element: (
          <ProtectedRoute>
            <HistoryManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/stats",
        element: (
          <ProtectedRoute>
            <StatsAnalysisPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
