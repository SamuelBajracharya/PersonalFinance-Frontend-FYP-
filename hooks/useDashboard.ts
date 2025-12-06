import { fetchDashboardAPI } from "@/api/dashboardAPI";
import { useMutation } from "@tanstack/react-query";

export const useFetchDashboard = () => {
  return useMutation({
    mutationFn: (accountId: string) => fetchDashboardAPI(accountId),
  });
};
