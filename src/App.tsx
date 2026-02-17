import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupPage } from "@/pages/SignupPage";
import { HomePage } from "@/pages/HomePage";
import { MatchPage } from "@/pages/MatchPage";
import { SettingPage } from "@/pages/SettingPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProfileNewPage } from "@/pages/ProfileNewPage";
import { ProfileEditPage } from "@/pages/ProfileEditPage";
import { SentProfilesPage } from "@/pages/SentProfilesPage";
import { ReceivedProfilesPage } from "@/pages/ReceivedProfilesPage";
import { ClientDetailPage } from "@/pages/ClientDetailPage";
import { AllManagersPage } from "@/pages/admin/AllManagersPage";
import { PendingManagersPage } from "@/pages/admin/PendingManagersPage";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";

// 보호된 라우트 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// 인증된 사용자용 라우트 컴포넌트 (로그인 페이지 접근 방지)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

// 관리자 전용 라우트 컴포넌트
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  /**
   * TODO: [API 개발 필요] 관리자 권한 체크
   * - 백엔드: 로그인 응답에 role: "ADMIN" 포함 필요
   * - 프론트: 아래 주석 해제하여 권한 체크 활성화
   */
  // const { currentUser } = useAuth();
  // if (currentUser?.role !== "ADMIN") return <Navigate to="/" replace />;

  return <>{children}</>;
}

function ProfileRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/client/${id}`} replace />;
}

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 관리자 페이지 - RootLayout 외부 (전체 너비) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AllManagersPage />} />
          <Route path="pending" element={<PendingManagersPage />} />
        </Route>

        {/* 일반 사용자 페이지 - RootLayout 내부 (모바일 너비) */}
        <Route
          element={
            <RootLayout>
              <Outlet />
            </RootLayout>
          }
        >
          {/* 인증 전 페이지 */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginForm />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            }
          />

          {/* 인증 후 페이지 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match"
            element={
              <ProtectedRoute>
                <MatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/new"
            element={
              <ProtectedRoute>
                <ProfileNewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/sent"
            element={
              <ProtectedRoute>
                <SentProfilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/received"
            element={
              <ProtectedRoute>
                <ReceivedProfilesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfileRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id/edit"
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/:clientId"
            element={
              <ProtectedRoute>
                <ClientDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
