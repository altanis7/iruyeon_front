import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "isAuthenticated";

export function useAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 초기 상태를 localStorage에서 가져옴
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === "true";
  });

  // localStorage 변경 감지 (다른 탭에서의 로그인/아웃 동기화)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(stored === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
    navigate("/");
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  return {
    isAuthenticated,
    login,
    logout,
  };
}
