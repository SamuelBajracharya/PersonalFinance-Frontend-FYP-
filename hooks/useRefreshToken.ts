import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { AxiosInstance } from "axios";
import { authInstance } from "@/api/axiosInstance"; // Assuming authInstance is exported from axiosInstance.ts

interface RefreshTokenResult {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  refresh: () => Promise<string | undefined>;
}

/**
 * Utility function to perform the token refresh logic.
 * Can be called by both the `useRefreshToken` hook and the Axios interceptor.
 * @param axiosInstance The Axios instance configured for authentication requests.
 * @returns A promise that resolves with the new access token, or rejects if refresh fails.
 */
export const performTokenRefresh = async (
  axiosAuthInstance: AxiosInstance
): Promise<string> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available. User must re-authenticate.");
  }

  try {
    const response = await axiosAuthInstance.post("/refresh", {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;

    if (access_token) {
      Cookies.set("accessToken", access_token, {
        expires: 1 / 24, // Example: expires in 1 hour (adjust as per backend token expiry)
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    }
    if (new_refresh_token) {
      // Assuming backend handles HttpOnly refresh token via Set-Cookie header.
      // If the backend returns refresh_token in body and client sets it, it cannot be HttpOnly.
      // Adjust expires and other options as per backend token expiry.
      Cookies.set("refreshToken", new_refresh_token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    }

    return access_token;
  } catch (refreshError) {
    console.error("Token refresh failed:", refreshError);
    // Clear tokens and potentially redirect to login on refresh failure
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    // In a real application, you might want to dispatch an event or redirect to login.
    // For now, re-throwing the error to be handled by the caller (interceptor or hook user).
    throw refreshError;
  }
};

/**
 * A reusable React hook for refreshing authentication tokens.
 * Can be used to manually trigger a refresh, or set up an automatic background refresh.
 *
 * @param options.autoRefreshInterval Optional. Interval in milliseconds for automatic background refreshing.
 *                                    If provided, the hook will attempt to refresh the token every `autoRefreshInterval`.
 */
export const useRefreshToken = (options?: { autoRefreshInterval?: number }): RefreshTokenResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      const newAccessToken = await performTokenRefresh(authInstance);
      setIsSuccess(true);
      return newAccessToken;
    } catch (err: any) {
      setError(err);
      setIsSuccess(false);
      // You might want to handle global logout/redirect here if refresh fails
      // E.g., if (typeof window !== "undefined") { window.location.href = "/login"; }
      throw err; // Re-throw so the caller can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options?.autoRefreshInterval && options.autoRefreshInterval > 0) {
      const intervalId = setInterval(() => {
        // Only attempt refresh if not currently refreshing
        if (!isLoading) {
          refresh().catch(() => {
            // Error already set by refresh()
            // Here you could log or decide to stop the interval on persistent failures
          });
        }
      }, options.autoRefreshInterval);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [options?.autoRefreshInterval, isLoading, refresh]);

  return { isLoading, error, isSuccess, refresh };
};

