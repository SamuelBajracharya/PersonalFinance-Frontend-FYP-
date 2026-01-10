import { baseInstance } from "./axiosInstance";

export type RewardType = "XP" | "BADGE" | "OTHER";

export interface RewardWithUnlockStatus {
  id: string;
  name: string;
  tier: number;
  reward_type: RewardType;
  requirement_value: number;
  created_at: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface UserReward {
  id: string;
  reward_id: string;
  unlocked_at: string;
  reward: {
    id: string;
    name: string;
    tier: number;
    reward_type: RewardType;
    requirement_value: number;
    created_at: string;
  };
}

export interface RecentReward {
  reward_id: string;
  name: string;
  xp_gained: number;
  unlocked_at: string;
}

export const fetchRecentRewardActivityAPI = async () => {
  const response = await baseInstance.get<RecentReward[]>(
    "/rewards/recent-activity"
  );
  return response.data;
};


export const fetchAllRewardsWithStatusAPI = async () => {
  const response = await baseInstance.get<RewardWithUnlockStatus[]>("/rewards");
  return response.data;
};


export const fetchMyUnlockedRewardsAPI = async () => {
  const response = await baseInstance.get<UserReward[]>("/rewards/me");
  return response.data;
};
