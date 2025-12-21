import { HttpResponse } from "msw";

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Success",
) {
  return HttpResponse.json({
    success: true,
    message,
    data,
  });
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(message: string, status: number = 400) {
  return HttpResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
}

/**
 * 네트워크 지연 시뮬레이션
 */
export async function simulateDelay(ms: number = 300): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}
