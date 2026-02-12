import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import { performTokenRefresh } from "@/hooks/useRefreshToken"; // Import the new utility function

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const authInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/auth",
  headers: { "Content-Type": "application/json" },
});

export const bankInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/bank",
  headers: { "Content-Type": "application/json" },
});

export const baseInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// A flag to prevent multiple token refresh attempts at once
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // If token is null, it means refresh failed, and we should reject
      // Or, if refresh was successful, retry with the new token
      if (token) {
        prom.resolve(token);
      } else {
        prom.reject(new Error("Token refresh failed."));
      }
    }
  });
  failedQueue = [];
};


export const attachAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers = config.headers || ({} as AxiosRequestHeaders);

      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
      const status = error.response?.status;

      // Check for 401, not already a retry, and not the refresh endpoint itself
      if (status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/refresh') {
        originalRequest._retry = true;

        // If a refresh is already in progress, queue the original request
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // Retry the original request with the new token
              if (originalRequest.headers && token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            // Use the utility function to perform refresh
            const newAccessToken = await performTokenRefresh(authInstance);

            // Update Authorization header for the original request
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            }

            // Retry the original request
            resolve(axiosInstance(originalRequest));

            // Process all requests that were queued while refreshing
            processQueue(null, newAccessToken);
          } catch (refreshError: unknown) {
            console.error("Session expired during interceptor refresh:", refreshError);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login"; // Redirect to login on refresh failure
            }
            reject(refreshError);
            processQueue(refreshError as AxiosError); // Notify queued requests of the failure
          } finally {
            isRefreshing = false;
          }
        });
      }

      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(baseInstance);
attachAuthInterceptor(bankInstance);
