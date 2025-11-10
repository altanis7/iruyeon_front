import { LoginForm } from "@/components/LoginForm";
import { Routes, Route } from "react-router-dom";
import RootLayout from "@/components/layouts/RootLayout";

const App = () => {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
