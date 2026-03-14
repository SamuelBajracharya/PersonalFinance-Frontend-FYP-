import { baseInstance } from "./axiosInstance";
import { AnalyticsResponse } from "@/types/analytics";

type AnalyticsPayload = {
  accountId: string;
  startDate?: string;
  endDate?: string;
};

export const fetchAnalyticsAPI = async (payload: AnalyticsPayload) => {
  const { accountId, startDate, endDate } = payload;
  const response = await baseInstance.get<AnalyticsResponse>(
    `/analytics/${accountId}`,
    {
      params: {
        startDate,
        endDate,
      },
    }
  );
  return response.data;
};
