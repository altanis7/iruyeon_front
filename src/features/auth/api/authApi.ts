import { apiClient } from "@/lib/api/client";
import axios from "axios";

// ========== 타입 정의 ==========

// API 요청 타입 (백엔드 스펙과 일치)
export interface SignupRequest {
  email: string;
  pwd: string;
  name: string;
  phoneNumber: string;
  gender: string;
  company: string;
}

// 프론트엔드 폼 타입 (passwordConfirm 포함)
export interface SignupFormData {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  company: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    phoneNumber: string;
    status: "pending" | "approved" | "rejected"; // 관리자 승인 대기 상태
    createdAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
    token?: string;
  };
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  success?: boolean;
  available?: boolean;
  message?: string;
}

// ========== 데이터 변환 함수 ==========

/**
 * 프론트엔드 폼 데이터를 API 요청 형식으로 변환
 */
export const transformSignupData = (
  formData: SignupFormData,
): SignupRequest => {
  return {
    email: formData.email,
    pwd: formData.password, // password → pwd 변환
    name: formData.name,
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    company: formData.company,
    // passwordConfirm은 제외 (프론트엔드 검증용)
  };
};

// ========== API 함수 ==========

/**
 * 회원가입 API
 */
export const signupAPI = async (
  data: SignupRequest,
): Promise<SignupResponse> => {
  try {
    const response = await apiClient.post<SignupResponse>("/signup", {
      ...data,
      imageId: null,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * 이메일 중복 확인 API
 */
export const checkEmailAPI = async (
  data: CheckEmailRequest,
): Promise<CheckEmailResponse> => {
  try {
    const response = await apiClient.post<CheckEmailResponse>(
      "/email/check",
      data,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "이메일 중복 확인에 실패했습니다.";
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * 로그인 API
 */
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "로그인에 실패했습니다.";
      throw new Error(message);
    }
    throw error;
  }
};
