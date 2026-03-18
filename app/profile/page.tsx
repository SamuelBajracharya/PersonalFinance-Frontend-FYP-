import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchMyUnlockedRewardsAPI } from "@/api/RewardsAPI";
import { createQueryClient } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { getServerAuthConfig } from "@/lib/serverAuth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const queryClient = createQueryClient();
  const authConfig = await getServerAuthConfig();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: queryKeys.rewards.mine,
      queryFn: () => fetchMyUnlockedRewardsAPI(authConfig),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient />
    </HydrationBoundary>
  );
}
