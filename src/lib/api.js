import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (typeof window !== "undefined" && err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    const config = err.config;
    // Network failure or 5xx (typical of a cold-starting serverless backend) —
    // retry once after a short delay before giving up. Never retries 4xx errors
    // (bad login, validation errors, etc.) since retrying those is pointless.
    const isRetriableError = !err.response || err.response.status >= 500;

    if (isRetriableError && config && !config.__isRetry) {
      config.__isRetry = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return api(config);
    }

    return Promise.reject(err);
  }
);

export default api;