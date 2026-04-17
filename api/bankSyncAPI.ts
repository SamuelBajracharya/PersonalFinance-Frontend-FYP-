import { syncInstance } from "./axiosInstance";
import Cookies from "js-cookie";

export interface SyncNowResponse {
    status: string;
    message: string;
    synced_accounts?: Array<{
        user_id: string;
        bank_name: string;
        account_number_masked: string;
        account_type: string;
        balance: number;
        account_id: string;
    }>;
    synced_stock_instruments?: number;
    bank_token?: string;
    synced_accounts_detail?: Array<{
        external_account_id: string;
        local_account_id: string;
        new_transactions: number;
        status: string;
    }>;
    [key: string]: any;
}

export interface SyncStatusResponse {
    user_id: string;
    last_successful_sync: string | null;
    last_attempted_sync: string | null;
    last_transaction_fetched_at: string | null;
    sync_status: string;
    failure_reason: string | null;
}

export const syncNowAPI = async (bankToken?: string): Promise<SyncNowResponse> => {
    const resolvedBankToken = bankToken ?? Cookies.get("bank_token");

    if (!resolvedBankToken) {
        throw new Error("Missing bank token. Please link your bank account again.");
    }

    const response = await syncInstance.post("/bank/sync-now", {
        bank_token: resolvedBankToken,
    });
    return response.data;
};

export const getBankSyncStatusAPI = async (): Promise<SyncStatusResponse> => {
    const response = await syncInstance.get("/bank/sync-status");
    return response.data;
};