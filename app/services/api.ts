import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://qngh2bv1-8000.asse.devtunnels.ms/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Example: set a fixed token
      config.headers.Authorization = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI2OTgwZWZkNTMwNzc5ZGZjZTIzOTE0NjMiLCJyb2xlIjoiQURNSU4iLCJkZXBhcnRtZW50IjoidW5kZWZpbmVkIiwiaWF0IjoxNzcwNDExNjgxLCJleHAiOjE3NzEwMTY0ODF9.pvKLAe3NjvWnEMeVzhMR_c3iogYpK_dVxTdyNifNqn4`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= REQUEST FUNCTIONS ================= */
export const getRequest = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.get<T>(url, config);
};

export const postRequest = <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return api.post<T>(url, data, config);
};

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
