import { http, HttpResponse } from "msw";
import {
  getPaginatedMatches,
  getPaginatedSentMatches,
  getPaginatedMatchedMatches,
} from "../data/match.data";
import { simulateDelay } from "../utils/response";

const BASE_URL = import.meta.env.VITE_API_URL;

export const matchHandlers = [
  /**
   * GET /match/received - 받은 매칭 목록 조회
   */
  http.get(`${BASE_URL}/api/v0/match/received`, async ({ request }) => {
    await simulateDelay(400);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const size = Number(url.searchParams.get("size")) || 10;

    const data = getPaginatedMatches(page, size);

    return HttpResponse.json({
      data,
      status: 200,
      message: "success",
      responseTime: new Date().toISOString(),
    });
  }),

  /**
   * GET /match/sent - 보낸 매칭 목록 조회
   */
  http.get(`${BASE_URL}/api/v0/match/sent`, async ({ request }) => {
    await simulateDelay(400);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const size = Number(url.searchParams.get("size")) || 10;

    const data = getPaginatedSentMatches(page, size);

    return HttpResponse.json({
      data,
      status: 200,
      message: "success",
      responseTime: new Date().toISOString(),
    });
  }),

  /**
   * GET /match/matched - 매칭 완료 목록 조회
   */
  http.get(`${BASE_URL}/api/v0/match/matched`, async ({ request }) => {
    await simulateDelay(400);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const size = Number(url.searchParams.get("size")) || 10;

    const data = getPaginatedMatchedMatches(page, size);

    return HttpResponse.json({
      data,
      status: 200,
      message: "success",
      responseTime: new Date().toISOString(),
    });
  }),
];
