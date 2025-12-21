import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_VERSION = "v0";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
});

// 쿠키에서 값 읽기
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
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
