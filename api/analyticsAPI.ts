import { baseInstance } from "./axiosInstance";
import { AnalyticsResponse } from "@/types/analytics";
import { AxiosRequestConfig } from "axios";

type AnalyticsPayload = {
  startDate?: string;
  endDate?: string;
};

export const fetchAnalyticsAPI = async (
  payload: AnalyticsPayload,
  config?: AxiosRequestConfig
) => {
  const { startDate, endDate } = payload;
  const response = await baseInstance.get<AnalyticsResponse>(
    "/analytics",
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
