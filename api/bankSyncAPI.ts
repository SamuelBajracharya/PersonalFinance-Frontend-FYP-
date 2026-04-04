import { syncInstance } from "./axiosInstance";
import Cookies from "js-cookie";

export interface SyncNowResponse {
    status: string;
    message: string;
    bank_token?: string;
    [key: string]: any;
}

export const syncNowAPI = async (): Promise<SyncNowResponse> => {
    const bankToken = Cookies.get("bank_token");

    if (!bankToken) {
        throw new Error("Missing bank token. Please link your bank account again.");
    }

    const response = await syncInstance.post("/bank/sync-now", {
        bank_token: bankToken,
    });
    return response.data;
};