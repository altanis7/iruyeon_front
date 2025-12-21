import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./globals.css";

// MSW 초기화
async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW === "true") {
    const { startMockServiceWorker } = await import("./mocks/browser");
    await startMockServiceWorker();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
