import { http, HttpResponse } from "msw";
import { getPaginatedClients } from "../data/client.data";
import { simulateDelay } from "../utils/response";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = "v0";

export const clientHandlers = [
  /**
   * GET /api/v0/client
   * 페이지네이션된 클라이언트 목록 조회
   */
  http.get(
    `${BASE_URL}/api/${API_VERSION}/client`,
    async ({ request }) => {
      await simulateDelay(400);

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const size = Number(url.searchParams.get("size")) || 10;

      const data = getPaginatedClients(page, size);

      return HttpResponse.json({
        data,
        status: 200,
        message: "success",
        responseTime: new Date().toISOString(),
      });
    },
  ),
];
