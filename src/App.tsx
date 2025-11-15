import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupPage } from "@/pages/SignupPage";
import { HomePage } from "@/pages/HomePage";
import { MatchPage } from "@/pages/MatchPage";
import { SettingPage } from "@/pages/SettingPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { ProfileNewPage } from "@/pages/ProfileNewPage";
import { ProfileEditPage } from "@/pages/ProfileEditPage";
import { SentProfilesPage } from "@/pages/SentProfilesPage";
import { ReceivedProfilesPage } from "@/pages/ReceivedProfilesPage";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";

// 보호된 라우트 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

// 인증된 사용자용 라우트 컴포넌트 (로그인 페이지 접근 방지)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Routes>
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
                <ProfileDetailPage />
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
        </Routes>
      </RootLayout>
    </QueryClientProvider>
  );
};

export default App;
