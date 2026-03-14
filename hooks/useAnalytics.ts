import { fetchAnalyticsAPI } from "@/api/analyticsAPI";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnalyticsResponse } from "@/types/analytics";

type AnalyticsPayload = {
  accountId: string;
  startDate?: string;
  endDate?: string;
};

type UseFetchAnalyticsParams = {
  accountId?: string | null;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
};

export const useFetchAnalytics = ({
  accountId,
  startDate,
  endDate,
  enabled = true,
}: UseFetchAnalyticsParams) => {
  return useQuery<AnalyticsResponse>({
    queryKey: ["analytics", accountId, startDate ?? null, endDate ?? null],
    queryFn: () =>
      fetchAnalyticsAPI({
        accountId: accountId as string,
        startDate,
        endDate,
      } as AnalyticsPayload),
    enabled: Boolean(accountId) && enabled,
    placeholderData: keepPreviousData,
  });
};
