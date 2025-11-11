import { LoginForm } from "@/components/LoginForm";
import { Routes, Route } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Routes>
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </RootLayout>
    </QueryClientProvider>
  );
};

export default App;
