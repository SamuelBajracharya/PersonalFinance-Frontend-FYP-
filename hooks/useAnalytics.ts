import { fetchAnalyticsAPI } from "@/api/analyticsAPI";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnalyticsResponse } from "@/types/analytics";
import { queryKeys } from "@/lib/queryKeys";

type AnalyticsPayload = {
  startDate?: string;
  endDate?: string;
};

type UseFetchAnalyticsParams = {
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
};

export const useFetchAnalytics = ({
  startDate,
  endDate,
  enabled = true,
}: UseFetchAnalyticsParams) => {
  return useQuery<AnalyticsResponse>({
    queryKey: queryKeys.analytics(startDate, endDate),
    queryFn: () =>
      fetchAnalyticsAPI({
        startDate,
        endDate,
      } as AnalyticsPayload),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3,
  });
};
