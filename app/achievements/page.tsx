"use client";

import React from "react";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";
import { useAllRewardsWithStatus } from "@/hooks/useRewards";

export default function AchievementsPage() {
  const { data: rewards, isLoading, error } = useAllRewardsWithStatus();

  if (isLoading) {
    return <p className="p-6">Loading achievements...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Failed to load achievements</p>;
  }

  const sortedRewards = [...(rewards ?? [])].sort((a, b) => {
    if (a.unlocked === b.unlocked) return 0;
    return a.unlocked ? -1 : 1;
  });

  return (
    <div className="p-6">
      {/* Achievements Grid */}
      <div className="grid grid-cols-6 gap-6">
        {sortedRewards.map((reward) => (
          <div key={reward.id} className={reward.unlocked ? "" : "opacity-40"}>
            <AchievementCard
              title={`${reward.name} ${reward.tier}`}
              subtitle={
                reward.unlocked
                  ? `Unlocked`
                  : `Locked • ${reward.requirement_value}`
              }
              reward_type={`${reward.reward_type}`}
            />
          </div>
        ))}

        {sortedRewards.length === 0 && (
          <p className="text-gray-400 col-span-6">No achievements available.</p>
        )}
      </div>
    </div>
  );
}
