import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

// Auth API instance
export const authInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/auth",
});

// Base API instance
export const baseInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});


export const attachAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers = config.headers || ({} as AxiosRequestHeaders);

      // Get the access token from cookies
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

attachAuthInterceptor(baseInstance);
