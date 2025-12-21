import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

/**
 * MSW 시작
 * - 개발 모드에서만 실행
 * - 환경 변수로 제어
 */
export async function startMockServiceWorker() {
  const shouldUseMSW = import.meta.env.VITE_USE_MSW === "true";

  if (!shouldUseMSW) {
    console.log("[MSW] Disabled by environment variable");
    return;
  }

  if (import.meta.env.MODE === "production") {
    console.log("[MSW] Skipped in production mode");
    return;
  }

  await worker.start({
    onUnhandledRequest: "bypass", // 처리되지 않은 요청은 통과
    serviceWorker: {
      url: "/mockServiceWorker.js", // Vite public 폴더 경로
    },
  });

  console.log("[MSW] Mocking enabled");
}
