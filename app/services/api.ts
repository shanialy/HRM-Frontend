import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:7000/api/v1/",
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

      config.headers.set("Authorization", `Bearer ${token}`);
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
