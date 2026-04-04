import { baseInstance } from "./axiosInstance";

export const fetchDashboardAPI = async () => {
  const response = await baseInstance.get("/dashboard");
  return response.data;
};
