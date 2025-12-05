import { baseInstance } from "./axiosInstance";

export const fetchAnalyticsAPI = async (accountId: string) => {
  const response = await baseInstance.get(`/analytics/${accountId}`);
  return response.data;
};
