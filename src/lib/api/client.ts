import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = "v0";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
});

// 쿠키 유틸리티
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(
  name: string,
  value: string,
  maxAgeDays: number = 7,
): void {
  const isSecure = window.location.protocol === "https:";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeDays * 86400}; SameSite=Strict${isSecure ? "; Secure" : ""}`;
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

apiClient.interceptors.request.use(
  config => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response 인터셉터: 에러 핸들링
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 401 Unauthorized 처리 등
    return Promise.reject(error);
  },
);
