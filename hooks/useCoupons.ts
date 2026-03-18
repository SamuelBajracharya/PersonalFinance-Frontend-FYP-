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
import { queryKeys } from "@/lib/queryKeys";

// GET /vouchers/{voucher_id}
export const useVoucherById = (voucherId: string) => {
  return useQuery<UserVoucher, unknown>({
    queryKey: queryKeys.vouchers.byId(voucherId),
    queryFn: () => fetchVoucherByIdAPI(voucherId),
    enabled: !!voucherId,
    staleTime: 1000 * 60 * 5,
  });
};

// GET /vouchers/available
export const useAvailableVoucherTemplates = () => {
  return useQuery<VoucherTemplate[], unknown>({
    queryKey: queryKeys.vouchers.templates,
    queryFn: () => fetchAvailableVoucherTemplatesAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
};

// GET /vouchers/me
export const useMyActiveVouchers = () => {
  return useQuery<UserVoucher[], unknown>({
    queryKey: queryKeys.vouchers.mine,
    queryFn: () => fetchMyActiveVouchersAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
};

// GET /vouchers/history
export const useVoucherHistory = () => {
  return useQuery<UserVoucher[], unknown>({
    queryKey: queryKeys.vouchers.history,
    queryFn: () => fetchVoucherHistoryAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
};

// POST /vouchers/redeem/{voucher_id}
export const useRedeemVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation<RedeemResponse, unknown, string>({
    mutationFn: (voucherId: string) => redeemVoucherAPI(voucherId),

    onSuccess: (_result, voucherId) => {
      // refresh voucher lists after redeem
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.templates });
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.byId(voucherId) });
    },
  });
};
