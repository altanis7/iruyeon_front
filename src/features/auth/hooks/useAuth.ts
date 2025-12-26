import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "isAuthenticated";
const USER_STORAGE_KEY = "currentUser";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 초기 상태를 localStorage에서 가져옴
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === "true";
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // localStorage 변경 감지 (다른 탭에서의 로그인/아웃 동기화)
  useEffect(() => {
    const handleStorageChange = () => {
      const authStored = localStorage.getItem(AUTH_STORAGE_KEY);
      const userStored = localStorage.getItem(USER_STORAGE_KEY);
      setIsAuthenticated(authStored === "true");
      setCurrentUser(userStored ? JSON.parse(userStored) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(
    (user: CurrentUser) => {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigate("/");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
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
