import { baseInstance } from "./axiosInstance";

export const fetchDashboardAPI = async (accountId: string) => {
  const response = await baseInstance.get(`/dashboard/${accountId}`);
  return response.data;
};
