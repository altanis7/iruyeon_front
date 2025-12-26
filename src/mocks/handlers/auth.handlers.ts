import { http } from "msw";
import type {
  SignupRequest,
  SignupResponse,
  CheckEmailRequest,
  CheckEmailResponse,
  LoginRequest,
  LoginResponse,
} from "@/features/auth/api/authApi";
import {
  findUserByEmail,
  addUser,
  validateLogin,
} from "../data/auth.data";
import {
  createSuccessResponse,
  createErrorResponse,
  simulateDelay,
} from "../utils/response";

const BASE_URL = import.meta.env.VITE_API_URL;

export const authHandlers = [
  /**
   * POST /api/v0/signup
   * 회원가입
   */
  http.post<never, SignupRequest>(
    `${BASE_URL}/api/v0/signup`,
    async ({ request }) => {
      await simulateDelay(500);

      const body = await request.json();
      const { email, pwd, name, phoneNumber, gender, company } = body;

      // 이메일 중복 검증
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return createErrorResponse("이미 등록된 이메일입니다.", 409);
      }

      // 사용자 생성
      const newUser = addUser({
        email,
        pwd,
        name,
        phoneNumber,
        gender,
        company,
        status: "pending", // 관리자 승인 대기
      });

      const response: SignupResponse = {
        success: true,
        message: "회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.",
        data: {
          id: newUser.id,
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      };

      return createSuccessResponse(response.data, response.message);
    },
  ),

  /**
   * POST /api/v0/email/check
   * 이메일 중복 확인
   */
  http.post<never, CheckEmailRequest>(
    `${BASE_URL}/api/v0/email/check`,
    async ({ request }) => {
      await simulateDelay(200);

      const body = await request.json();
      const { email } = body;

      const existingUser = findUserByEmail(email);
      const available = !existingUser;

      const response: CheckEmailResponse = {
        success: true,
        available,
        message: available
          ? "사용 가능한 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      };

      return createSuccessResponse(response, response.message);
    },
  ),

  /**
   * POST /api/v0/login
   * 로그인
   */
  http.post<never, LoginRequest>(
    `${BASE_URL}/api/v0/login`,
    async ({ request }) => {
      await simulateDelay(300);

      const body = await request.json();
      const { email, password } = body;

      const user = validateLogin(email, password);

      if (!user) {
        return createErrorResponse(
          "이메일 또는 비밀번호가 올바르지 않습니다.",
          401,
        );
      }

      // Mock 토큰 생성 (실제로는 JWT)
      const mockToken = `mock_token_${user.id}_${Date.now()}`;

      const responseData: LoginResponse = {
        success: true,
        message: "로그인에 성공했습니다.",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: mockToken,
        },
      };

      // Set-Cookie 헤더 추가
      const response = createSuccessResponse(
        responseData.data,
        responseData.message,
      );
      response.headers.set(
        "Set-Cookie",
        `access_token=${mockToken}; Path=/; Max-Age=86400; SameSite=Lax`,
      );

      return response;
    },
  ),
];
