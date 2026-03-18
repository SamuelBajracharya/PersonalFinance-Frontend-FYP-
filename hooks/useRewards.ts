import {
  fetchAllRewardsWithStatusAPI,
  fetchMyUnlockedRewardsAPI,
  fetchRecentRewardActivityAPI,
  RewardWithUnlockStatus,
  UserReward,
  RecentReward,
} from "@/api/RewardsAPI";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export const useAllRewardsWithStatus = () => {
  return useQuery<RewardWithUnlockStatus[], unknown>({
    queryKey: queryKeys.rewards.all,
    queryFn: () => fetchAllRewardsWithStatusAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
  });
};

export const useMyUnlockedRewards = () => {
  return useQuery<UserReward[], unknown>({
    queryKey: queryKeys.rewards.mine,
    queryFn: () => fetchMyUnlockedRewardsAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecentRewardActivity = () => {
  return useQuery<RecentReward[], unknown>({
    queryKey: queryKeys.rewards.recentActivity,
    queryFn: () => fetchRecentRewardActivityAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });
};
