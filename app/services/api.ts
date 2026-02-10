import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://3.84.184.87:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ TOKEN INTERCEPTOR (DYNAMIC)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= REQUEST FUNCTIONS ================= */

export const getRequest = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => api.get<T>(url, config);

export const postRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => api.post<T>(url, data, config);

export const putRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.put<T>(url, data, config);
};

export const deleteRequest = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.delete<T>(url, config);
};

export default api;
