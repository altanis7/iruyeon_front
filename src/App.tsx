import { Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/login-form";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
    </Routes>
  );
};

export default App;
