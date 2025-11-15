import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupPage } from "@/pages/SignupPage";
import { Routes, Route } from "react-router-dom";
import RootLayout from "@/shared/components/layouts/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </RootLayout>
    </QueryClientProvider>
  );
};

export default App;
