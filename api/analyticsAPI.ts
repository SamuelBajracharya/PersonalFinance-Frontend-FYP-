import { baseInstance } from "./axiosInstance";

export const fetchAnalyticsAPI = async (externalAccountId: string) => {
  const response = await baseInstance.get(`/analytics/${externalAccountId}`);
  return response.data;
};
