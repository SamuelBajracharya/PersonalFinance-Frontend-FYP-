
import { baseInstance } from "./axiosInstance";
import { AxiosRequestConfig } from "axios";

export interface VoucherTemplate {
  id: string;
  title: string;
  description: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  partner_id: string;
  tier_required: number;
}

export interface UserVoucher {
  id: string;
  code: string;
  issued_at: string;
  expires_at: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
  title: string;
  description: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT";
  discount_value: number;
  partner_id: string;
  tier_required: number;
}

export interface RedeemResponse {
  id: string;
  code: string;
  status: "REDEEMED";
  expires_at: string;
}

// GET /vouchers/{voucher_id}
export const fetchVoucherByIdAPI = async (
  voucherId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<UserVoucher>(
    `/vouchers/${voucherId}`,
    config
  );
  return response.data;
};

// GET /vouchers/available
export const fetchAvailableVoucherTemplatesAPI = async (
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<VoucherTemplate[]>(
    "/vouchers/available",
    config
  );
  return response.data;
};

// GET /vouchers/me
export const fetchMyActiveVouchersAPI = async (config?: AxiosRequestConfig) => {
  const response = await baseInstance.get<UserVoucher[]>("/vouchers/me", config);
  return response.data;
};

// GET /vouchers/history
export const fetchVoucherHistoryAPI = async (config?: AxiosRequestConfig) => {
  const response = await baseInstance.get<UserVoucher[]>(
    "/vouchers/history",
    config
  );
  return response.data;
};

// POST /vouchers/redeem/{voucher_id}
export const redeemVoucherAPI = async (voucherId: string) => {
  const response = await baseInstance.post<RedeemResponse>(
    `/vouchers/redeem/${voucherId}`,
  );
  return response.data;
};
