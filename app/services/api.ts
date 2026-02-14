import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://qngh2bv1-8000.asse.devtunnels.ms/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= TOKEN INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      config.headers.set(
        "Authorization",
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI2OTgwZWZkNTMwNzc5ZGZjZTIzOTE0NjMiLCJyb2xlIjoiQURNSU4iLCJkZXBhcnRtZW50IjoidW5kZWZpbmVkIiwiaWF0IjoxNzcxMDMwMDc4LCJleHAiOjE3NzE2MzQ4Nzh9.xGMUAj6fTpibrEOVK62_zHkTJYQ3TxHWF0YxNx7kID4`,
      );
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= REQUEST HELPERS ================= */

export const getRequest = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => api.get<T>(url, config);

export const postRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => api.post<T>(url, data, config);

export const putRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => api.put<T>(url, data, config);

export const deleteRequest = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => api.delete<T>(url, config);

export default api;
