import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const authInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/auth",
  headers: { "Content-Type": "application/json" },
});

export const baseInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

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

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await authInstance.post("/refresh", {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: new_refresh_token } =
            response.data;

          Cookies.set("accessToken", access_token);
          Cookies.set("refreshToken", new_refresh_token);

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          }

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Session expired", refreshError);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(baseInstance);
