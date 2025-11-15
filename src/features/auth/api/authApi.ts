// ========== 타입 정의 ==========

export interface SignupRequest {
  name: string;
  phoneNumber: string; // 아이디 (휴대폰번호 형식: 010-1234-5678)
  password: string;
  passwordConfirm: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    phoneNumber: string;
    status: 'pending' | 'approved' | 'rejected'; // 관리자 승인 대기 상태
    createdAt: string;
  };
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    phoneNumber: string;
    token?: string;
  };
}

// ========== API 함수 ==========

/**
 * Mock API: 회원가입
 * 실제 백엔드 API가 준비되면 이 함수를 교체하세요
 */
export const signupAPI = async (data: SignupRequest): Promise<SignupResponse> => {
  // 2초 딜레이 (네트워크 요청 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock: 성공 응답
  return {
    success: true,
    message: '가입 신청이 완료되었습니다. 관리자 승인 대기 중입니다.',
    data: {
      id: `user_${Date.now()}`,
      name: data.name,
      phoneNumber: data.phoneNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  };

  // Mock: 에러 케이스 (필요시 주석 해제)
  // if (data.phoneNumber === '010-0000-0000') {
  //   throw new Error('이미 가입된 휴대폰 번호입니다.');
  // }
};

/**
 * Mock API: 로그인
 * 실제 백엔드 API가 준비되면 이 함수를 교체하세요
 */
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    message: '로그인에 성공했습니다.',
    data: {
      id: 'user_123',
      name: '홍길동',
      phoneNumber: data.phoneNumber,
      token: 'mock_jwt_token',
    },
  };
};
