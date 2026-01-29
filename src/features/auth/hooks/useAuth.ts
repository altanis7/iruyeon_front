import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  getCookie,
  setCookie,
  removeCookie,
} from "@/lib/api/client";

export interface CurrentUser {
  id: string;
  role: string;
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
    (token: string, user: CurrentUser) => {
      setCookie("access_token", token);
      setCookie("current_user", JSON.stringify(user));
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigate("/");
    },
    [navigate],
  );

  const logout = useCallback(() => {
    removeCookie("access_token");
    removeCookie("current_user");
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
