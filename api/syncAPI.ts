import { baseInstance } from "./axiosInstance";

export const syncBankDataAPI = async (accountId: string) => {
  const response = await baseInstance.post(`/bank/sync/${accountId}`);
  return response.data;
};
