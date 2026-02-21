import { baseInstance } from "./axiosInstance";

export const fetchDashboardAPI = async (externalAccountId: string) => {
  const response = await baseInstance.get(`/dashboard/${externalAccountId}`);
  return response.data;
};
