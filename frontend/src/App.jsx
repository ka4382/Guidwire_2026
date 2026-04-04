import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminClaimsReviewPage } from "./pages/AdminClaimsReviewPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminFraudAlertsPage } from "./pages/AdminFraudAlertsPage";
import { ClaimsPage } from "./pages/ClaimsPage";
import { FileClaimPage } from "./pages/FileClaimPage";
import { LandingPage } from "./pages/LandingPage";
import { LiveMonitorPage } from "./pages/LiveMonitorPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PayoutHistoryPage } from "./pages/PayoutHistoryPage";
import { PolicyDashboardPage } from "./pages/PolicyDashboardPage";
import { QuotePage } from "./pages/QuotePage";
import { RegisterPage } from "./pages/RegisterPage";
import { WorkerOnboardingPage } from "./pages/WorkerOnboardingPage";

function ShellPage({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <ShellPage>
              <WorkerOnboardingPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quote"
        element={
          <ProtectedRoute roles={["worker"]}>
            <ShellPage>
              <QuotePage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["worker"]}>
            <ShellPage>
              <PolicyDashboardPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <ShellPage>
              <LiveMonitorPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedRoute roles={["worker"]}>
            <ShellPage>
              <ClaimsPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/file-claim"
        element={
          <ProtectedRoute roles={["worker"]}>
            <ShellPage>
              <FileClaimPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payouts"
        element={
          <ProtectedRoute roles={["worker"]}>
            <ShellPage>
              <PayoutHistoryPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ShellPage>
              <AdminDashboardPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/claims"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ShellPage>
              <AdminClaimsReviewPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fraud"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ShellPage>
              <AdminFraudAlertsPage />
            </ShellPage>
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
