import { http, HttpResponse } from "msw";
import {
  getPaginatedClients,
  getClientDetail,
  getPaginatedMyClients,
  toggleClientStatus,
  updateClientDetail,
  deleteClientById,
} from "../data/client.data";
import { simulateDelay } from "../utils/response";
import type { UpdateClientRequest } from "@/features/profile/api/profileApi";

const BASE_URL = import.meta.env.VITE_API_URL;

export const clientHandlers = [
  /**
   * GET /api/v0/client
   * 페이지네이션된 클라이언트 목록 조회
   */
  http.get(
    `${BASE_URL}/api/v0/client`,
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

  /**
   * GET /api/v0/client/my
   * 내 회원 목록 조회
   */
  http.get(
    `${BASE_URL}/api/v0/client/my`,
    async ({ request }) => {
      await simulateDelay(300);

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 1;
      const size = Number(url.searchParams.get("size")) || 10;

      const data = getPaginatedMyClients(page, size);

      return HttpResponse.json({
        data,
        status: 200,
        message: "success",
        responseTime: new Date().toISOString(),
      });
    },
  ),

  /**
   * GET /api/v0/client/:clientId
   * 클라이언트 상세 조회
   */
  http.get(
    `${BASE_URL}/api/v0/client/:clientId`,
    async ({ params }) => {
      await simulateDelay(500);

      const clientId = Number(params.clientId);
      const clientDetail = getClientDetail(clientId);

      if (!clientDetail) {
        return HttpResponse.json(
          {
            data: null,
            status: 404,
            message: "Client not found",
            responseTime: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        data: clientDetail,
        status: 200,
        message: "success",
        responseTime: new Date().toISOString(),
      });
    },
  ),

  /**
   * PATCH /api/v0/client/status/:memberId
   * 클라이언트 상태 토글
   */
  http.patch(
    `${BASE_URL}/api/v0/client/status/:memberId`,
    async ({ params }) => {
      await simulateDelay(300);

      const memberId = Number(params.memberId);
      const result = toggleClientStatus(memberId);

      if (!result) {
        return HttpResponse.json(
          {
            data: null,
            status: 404,
            message: "Client not found",
            responseTime: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        data: {
          clientId: result.clientId,
          newStatus: result.newStatus,
          message: `상태가 ${result.newStatus === "ACTIVE" ? "활동" : "비활동"}으로 변경되었습니다.`,
        },
        status: 200,
        message: "success",
        responseTime: new Date().toISOString(),
      });
    },
  ),

  /**
   * PATCH /api/v0/client/:clientId
   * 클라이언트 정보 수정
   */
  http.patch(
    `${BASE_URL}/api/v0/client/:clientId`,
    async ({ request, params }) => {
      await simulateDelay(500);

      const clientId = Number(params.clientId);
      const body = (await request.json()) as Omit<UpdateClientRequest, 'clientId'>;
      const { family, ...otherUpdates } = body;

      // Convert family array to ClientFamilyMember format
      const updatedClient = updateClientDetail(clientId, {
        ...otherUpdates,
        families: family,
      });

      if (!updatedClient) {
        return HttpResponse.json(
          {
            data: null,
            status: 404,
            message: "Client not found",
            responseTime: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        data: updatedClient,
        status: 200,
        message: "클라이언트 정보가 수정되었습니다.",
        responseTime: new Date().toISOString(),
      });
    },
  ),

  /**
   * DELETE /api/v0/client
   * 클라이언트 삭제
   */
  http.delete(
    `${BASE_URL}/api/v0/client`,
    async ({ request }) => {
      await simulateDelay(400);

      const body = (await request.json()) as { clientId: number };
      const { clientId } = body;

      const deleted = deleteClientById(clientId);

      if (!deleted) {
        return HttpResponse.json(
          {
            data: { success: false, message: "Client not found" },
            status: 404,
            message: "Client not found",
            responseTime: new Date().toISOString(),
          },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        data: {
          success: true,
          message: "클라이언트가 삭제되었습니다.",
        },
        status: 200,
        message: "success",
        responseTime: new Date().toISOString(),
      });
    },
  ),
];
