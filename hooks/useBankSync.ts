import { useMutation } from "@tanstack/react-query";
import { syncNowAPI, SyncNowResponse } from "@/api/bankSyncAPI";
import Cookies from "js-cookie";

export const useBankSync = () => {
    return useMutation<SyncNowResponse, unknown, void>({
        mutationFn: () => syncNowAPI(),
        onSuccess: (data) => {
            if (data.bank_token) {
                Cookies.set("bank_token", data.bank_token, { expires: 7, secure: true, sameSite: "strict" });
            }
        },
    });
};