import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://270gz0rm-8000.inc1.devtunnels.ms/api/v1/",
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
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaGVlbDk5QGdtYWlsLmNvbSIsImlkIjoiNjk5MzAzMDFiYzA3NDAwMWIxM2E4ZDAwIiwicm9sZSI6IkVNUExPWUVFIiwiZGVwYXJ0bWVudCI6IlNBTEVTIiwiaWF0IjoxNzcxNDAxNjMzLCJleHAiOjE3NzIwMDY0MzN9.qLiBGeVAtldLVlSq4VE7LAWrbRxfScv9mc-z27MqFQk`,
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
