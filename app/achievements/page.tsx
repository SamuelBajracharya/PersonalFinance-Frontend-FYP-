"use client";

import React from "react";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import { useAllRewardsWithStatus } from "@/hooks/useRewards";

export default function AchievementsPage() {
  const { data: rewards, isLoading, error } = useAllRewardsWithStatus();
  const showInitialSkeletons = isLoading && !rewards;

  const sortedRewards = [...(rewards ?? [])].sort((a, b) => {
    if (a.unlocked === b.unlocked) return 0;
    return a.unlocked ? -1 : 1;
  });

  return (
    <div className="p-6">
      {error && !showInitialSkeletons && (
        <p className="mb-6 text-red-500">Failed to load achievements</p>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-6 gap-6">
        {showInitialSkeletons
          ? Array.from({ length: 12 }).map((_, index) => (
            <SkeletonBlock
              key={index}
              className="w-full aspect-[3/2] rounded-4xl bg-tableBG"
            />
          ))
          : sortedRewards.map((reward) => (
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

        {!showInitialSkeletons && sortedRewards.length === 0 && (
          <p className="text-gray-400 col-span-6">No achievements available.</p>
        )}
      </div>

      <LoadingOverlay show={isLoading} />
    </div>
  );
}
