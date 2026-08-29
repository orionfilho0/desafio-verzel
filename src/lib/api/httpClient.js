import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("elitetix_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      const hadSession = Boolean(localStorage.getItem("elitetix_token"));
      localStorage.removeItem("elitetix_token");
      localStorage.removeItem("elitetix_role");
      localStorage.removeItem("elitetix_user");
      if (window.location.pathname !== "/login") window.location.assign(hadSession ? "/login?sessionExpired=1" : "/login");
    }
    return Promise.reject(error);
  },
);

export default httpClient;
