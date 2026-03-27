import { syncInstance } from "./axiosInstance";

export interface SyncNowResponse {
    status: string;
    message: string;
    bank_token?: string;
    [key: string]: any;
}

export const syncNowAPI = async (): Promise<SyncNowResponse> => {
    const response = await syncInstance.post("/bank/sync-now");
    return response.data;
};