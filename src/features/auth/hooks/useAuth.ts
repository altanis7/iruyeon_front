import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  getCookie,
  setCookie,
  removeCookie,
} from "@/lib/api/client";
import type { UserRole, UserStatus } from "@/features/auth/api/authApi";

export interface CurrentUser {
  id: string;
  role: UserRole;
  status: UserStatus;
}

// 자동 로그인 설정 저장/조회
const AUTO_LOGIN_KEY = "auto_login";

export function getAutoLoginSetting(): boolean {
  return localStorage.getItem(AUTO_LOGIN_KEY) === "true";
}

export function setAutoLoginSetting(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(AUTO_LOGIN_KEY, "true");
  } else {
    localStorage.removeItem(AUTO_LOGIN_KEY);
  }
}

export function useAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getCookie("access_token");
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const stored = getCookie("current_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(
    (token: string, user: CurrentUser, autoLogin: boolean = false) => {
      // 자동 로그인 설정에 따라 쿠키 만료 시간 조정
      const maxAgeDays = autoLogin ? 30 : 1; // 자동 로그인: 30일, 아니면: 1일
      setCookie("access_token", token, maxAgeDays);
      setCookie("current_user", JSON.stringify(user), maxAgeDays);
      setAutoLoginSetting(autoLogin);
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigate("/");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    removeCookie("access_token");
    removeCookie("current_user");
    setAutoLoginSetting(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/login");
  }, [navigate]);

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
  };
}
