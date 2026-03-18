"use client";

import { useState, useCallback, useEffect } from "react";
import { authInstance } from "@/api/axiosInstance"; // Assuming authInstance is exported from axiosInstance.ts
import { performTokenRefresh } from "@/lib/tokenRefresh";

interface RefreshTokenResult {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  refresh: () => Promise<string | undefined>;
}

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

