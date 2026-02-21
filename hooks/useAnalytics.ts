import { fetchAnalyticsAPI } from "@/api/analyticsAPI";
import { useMutation } from "@tanstack/react-query";

export const useFetchAnalytics = () => {
  return useMutation({
    mutationFn: (externalAccountId: string) =>
      fetchAnalyticsAPI(externalAccountId),
  });
};
