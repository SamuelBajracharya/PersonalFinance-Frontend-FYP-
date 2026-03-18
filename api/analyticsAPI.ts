import { baseInstance } from "./axiosInstance";
import { AnalyticsResponse } from "@/types/analytics";
import { AxiosRequestConfig } from "axios";

type AnalyticsPayload = {
  accountId: string;
  startDate?: string;
  endDate?: string;
};

export const fetchAnalyticsAPI = async (
  payload: AnalyticsPayload,
  config?: AxiosRequestConfig
) => {
  const { accountId, startDate, endDate } = payload;
  const response = await baseInstance.get<AnalyticsResponse>(
    `/analytics/${accountId}`,
    {
      ...config,
      params: {
        startDate,
        endDate,
      },
    }
  );
  return response.data;
};
