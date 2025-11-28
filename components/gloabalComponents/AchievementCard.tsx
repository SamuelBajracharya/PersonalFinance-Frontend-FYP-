"use client";

import React from "react";
import { FaFire } from "react-icons/fa";

interface AchievementCardProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export default function AchievementCard({
  title,
  subtitle,
  icon = <FaFire className="text-orange-400 size-12" />,
}: AchievementCardProps) {
  return (
    <div className="bg-tableBG px-6 py-6 rounded-4xl flex flex-col justify-center items-center aspect-[3/2]">
      <div className="mb-3">{icon}</div>
      <p className="font-semibold text-white text-lg mb-1">{title}</p>
      <p className="text-gray-300 text-sm">{subtitle}</p>
    </div>
  );
}
