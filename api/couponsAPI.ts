import { baseInstance } from "./axiosInstance";

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

// GET /vouchers/available
export const fetchAvailableVoucherTemplatesAPI = async () => {
  const response = await baseInstance.get<VoucherTemplate[]>(
    "/vouchers/available",
  );
  return response.data;
};

// GET /vouchers/me
export const fetchMyActiveVouchersAPI = async () => {
  const response = await baseInstance.get<UserVoucher[]>("/vouchers/me");
  return response.data;
};

// GET /vouchers/history
export const fetchVoucherHistoryAPI = async () => {
  const response = await baseInstance.get<UserVoucher[]>("/vouchers/history");
  return response.data;
};

// POST /vouchers/redeem/{voucher_id}
export const redeemVoucherAPI = async (voucherId: string) => {
  const response = await baseInstance.post<RedeemResponse>(
    `/vouchers/redeem/${voucherId}`,
  );
  return response.data;
};
