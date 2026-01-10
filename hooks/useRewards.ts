import {
  fetchAllRewardsWithStatusAPI,
  fetchMyUnlockedRewardsAPI,
  fetchRecentRewardActivityAPI,
  RewardWithUnlockStatus,
  UserReward,
  RecentReward,
} from "@/api/RewardsAPI";
import { useQuery } from "@tanstack/react-query";

export const useAllRewardsWithStatus = () => {
  return useQuery<RewardWithUnlockStatus[], unknown>({
    queryKey: ["rewards", "all"],
    queryFn: () => fetchAllRewardsWithStatusAPI(),
  });
};

export const useMyUnlockedRewards = () => {
  return useQuery<UserReward[], unknown>({
    queryKey: ["rewards", "me"],
    queryFn: () => fetchMyUnlockedRewardsAPI(),
  });
};

export const useRecentRewardActivity = () => {
  return useQuery<RecentReward[], unknown>({
    queryKey: ["rewards", "recent-activity"],
    queryFn: () => fetchRecentRewardActivityAPI(),
  });
};
