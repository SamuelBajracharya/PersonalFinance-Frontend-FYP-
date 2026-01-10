"use client";

import React from "react";
import { FaFire, FaPiggyBank, FaBullseye } from "react-icons/fa";

interface AchievementCardProps {
  title: string;
  subtitle: string;
  reward_type: string;
}

const getRewardIcon = (reward_type: string) => {
  switch (reward_type) {
    case "XP":
      return <FaFire className="text-orange-400 size-12" />;

    case "BUDGET_GOALS":
      return <FaBullseye className="text-blue-400 size-12" />;

    case "SAVINGS":
      return <FaPiggyBank className="text-green-400 size-12" />;

    default:
      return <FaFire className="text-orange-400 size-12" />;
  }
};

const getRewardUnit = (reward_type: string) => {
  switch (reward_type) {
    case "XP":
      return "XP";

    case "BUDGET_GOALS":
      return "Goals";

    case "SAVINGS":
      return "Rupees";

    default:
      return "";
  }
};

export default function AchievementCard({
  title,
  subtitle,
  reward_type,
}: AchievementCardProps) {
  return (
    <div className="bg-tableBG px-6 py-6 rounded-4xl flex flex-col justify-center items-center aspect-[3/2]">
      <div className="mb-3">{getRewardIcon(reward_type)}</div>

      <p className="font-semibold text-white text-lg mb-1 text-center">
        {title}
      </p>

      <p className="text-gray-300 text-sm text-center">
        {subtitle}
        {getRewardUnit(reward_type) && (
          <span className="ml-1 text-gray-400">
            {getRewardUnit(reward_type)}
          </span>
        )}
      </p>
    </div>
  );
}
