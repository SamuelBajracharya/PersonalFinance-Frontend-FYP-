import {
  fetchAvailableVoucherTemplatesAPI,
  fetchMyActiveVouchersAPI,
  fetchVoucherHistoryAPI,
  redeemVoucherAPI,
  VoucherTemplate,
  UserVoucher,
  RedeemResponse,
  fetchVoucherByIdAPI,
} from "@/api/couponsAPI";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// GET /vouchers/{voucher_id}
export const useVoucherById = (voucherId: string) => {
  return useQuery<UserVoucher, unknown>({
    queryKey: ["voucher", voucherId],
    queryFn: () => fetchVoucherByIdAPI(voucherId),
    enabled: !!voucherId,
  });
};

// GET /vouchers/available
export const useAvailableVoucherTemplates = () => {
  return useQuery<VoucherTemplate[], unknown>({
    queryKey: ["voucher-templates"],
    queryFn: () => fetchAvailableVoucherTemplatesAPI(),
  });
};

// GET /vouchers/me
export const useMyActiveVouchers = () => {
  return useQuery<UserVoucher[], unknown>({
    queryKey: ["my-vouchers"],
    queryFn: () => fetchMyActiveVouchersAPI(),
  });
};

// GET /vouchers/history
export const useVoucherHistory = () => {
  return useQuery<UserVoucher[], unknown>({
    queryKey: ["voucher-history"],
    queryFn: () => fetchVoucherHistoryAPI(),
  });
};

// POST /vouchers/redeem/{voucher_id}
export const useRedeemVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation<RedeemResponse, unknown, string>({
    mutationFn: (voucherId: string) => redeemVoucherAPI(voucherId),

    onSuccess: () => {
      // refresh voucher lists after redeem
      queryClient.invalidateQueries({ queryKey: ["my-vouchers"] });
      queryClient.invalidateQueries({ queryKey: ["voucher-history"] });
    },
  });
};
