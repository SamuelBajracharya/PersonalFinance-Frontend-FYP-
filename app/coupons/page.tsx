import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchAvailableVoucherTemplatesAPI, fetchMyActiveVouchersAPI, fetchVoucherHistoryAPI } from "@/api/couponsAPI";
import { createQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getServerAuthConfig } from "@/lib/serverAuth";
import CouponsClient from "./CouponsClient";

export default async function CouponsPage() {
  const queryClient = createQueryClient();
  const authConfig = await getServerAuthConfig();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: queryKeys.vouchers.templates,
      queryFn: () => fetchAvailableVoucherTemplatesAPI(authConfig),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.vouchers.mine,
      queryFn: () => fetchMyActiveVouchersAPI(authConfig),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.vouchers.history,
      queryFn: () => fetchVoucherHistoryAPI(authConfig),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CouponsClient />
    </HydrationBoundary>
  );
}
