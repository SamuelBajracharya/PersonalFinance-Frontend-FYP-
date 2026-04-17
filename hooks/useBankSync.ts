import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    syncNowAPI,
    SyncNowResponse,
    getBankSyncStatusAPI,
    SyncStatusResponse,
} from "@/api/bankSyncAPI";
import Cookies from "js-cookie";
import { queryKeys } from "@/lib/queryKeys";

export const useBankSync = () => {
    const queryClient = useQueryClient();

    return useMutation<SyncNowResponse, unknown, { bankToken?: string } | void>({
        mutationFn: (variables) => syncNowAPI(variables?.bankToken),
        onSuccess: (data) => {
            if (data.bank_token) {
                Cookies.set("bank_token", data.bank_token, { expires: 7, secure: true, sameSite: "strict" });
            }

            queryClient.invalidateQueries({ queryKey: queryKeys.bank.accounts });
            queryClient.invalidateQueries({ queryKey: queryKeys.bank.account });
            queryClient.invalidateQueries({ queryKey: queryKeys.bank.transactions });
            queryClient.invalidateQueries({ queryKey: queryKeys.bank.syncStatus });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            queryClient.invalidateQueries({ queryKey: ["analytics"] });
            queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
        },
    });
};

export const useBankSyncStatus = (enabled = true) => {
    return useQuery<SyncStatusResponse>({
        queryKey: queryKeys.bank.syncStatus,
        queryFn: getBankSyncStatusAPI,
        enabled,
        staleTime: 1000 * 30,
    });
};