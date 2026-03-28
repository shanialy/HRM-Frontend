import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import toast from "react-hot-toast";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:7000/api/v1/",
  // "https://wst2pk24-7000.inc1.devtunnels.ms"
  // baseURL: "https://d15mne01ku2os0.cloudfront.net/api/v1/",
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

/* ================= RESPONSE INTERCEPTOR ================= */

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => {
    const message = response?.data?.message;

    if (message) {
      toast.success(message);
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    if (status === 401) {
      toast.error("Session expired. Please login again.");

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
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
export const patchRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => api.patch<T>(url, data, config);

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
