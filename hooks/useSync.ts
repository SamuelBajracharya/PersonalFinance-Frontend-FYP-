import { syncBankDataAPI } from "@/api/syncAPI";
import { useMutation } from "@tanstack/react-query";

export const useSyncBankData = () => {
  return useMutation({
    mutationFn: (accountId: string) => syncBankDataAPI(accountId),
  });
};
