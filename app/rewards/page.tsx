"use client";

import { ActiveGoal } from "@/components/gloabalComponents/ActiveGoal";
import { RecentActivityItem } from "@/components/gloabalComponents/RecentActivityCard";
import { WhatIfCard } from "@/components/gloabalComponents/WhatIfCard";
import React from "react";
import { BsTrophy } from "react-icons/bs";

export default function Rewards() {
  return (
    <div className="min-h-screen p-6 font-sans text-gray-200">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* === LEFT COLUMN (Wider) === */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* 1. What If Section */}
          <div>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              What If?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WhatIfCard
                percentage={20}
                category="Food & Dining"
                saveAmount={40}
              />
              <WhatIfCard
                percentage={20}
                category="Food & Dining"
                saveAmount={40}
              />
              <WhatIfCard
                percentage={20}
                category="Food & Dining"
                saveAmount={40}
              />
              <WhatIfCard
                percentage={20}
                category="Food & Dining"
                saveAmount={40}
              />
            </div>
          </div>

          {/* 2. Active Goals Section */}
          <div>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              Active Goals
            </h2>
            <div className="flex flex-col gap-4">
              <ActiveGoal title="Food and Dining" saved={16} target={40} />
              <ActiveGoal title="Food and Dining" saved={16} target={40} />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (Narrower) === */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* 1. Experience / Level Card */}
          <div className="bg-secondaryBG p-8 rounded-3xl flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 border border-primary px-6 py-3 rounded-full text-primary text-[16px] font-medium mb-6">
              <BsTrophy size={24} />
              Silver Saver
            </div>

            <div className="text-5xl font-bold text-primary mb-1">1260</div>
            <div className="text-gray-200 text-[16px] mb-8">
              Experience Points
            </div>

            <div className="w-full">
              <div className="h-2 bg-accentBG rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-primary w-[70%] rounded-full"></div>
              </div>
              <p className="text-gray-200 text-[16px]">
                1740 XP more to Gold Level
              </p>
            </div>
          </div>

          {/* 2. Recent Activities Section */}
          <div>
            <h2 className="text-textmain text-2xl font-semibold tracking-wide mb-4">
              Recent Activities
            </h2>
            <div className="flex flex-col gap-4">
              <RecentActivityItem
                title="Completed Coffee Goal week 1"
                time="2 hours ago"
                xp={10}
              />
              <RecentActivityItem
                title="Completed Coffee Goal week 1"
                time="2 hours ago"
                xp={10}
              />
              <RecentActivityItem
                title="Completed Coffee Goal week 1"
                time="2 hours ago"
                xp={10}
              />
              <RecentActivityItem
                title="Completed Coffee Goal week 1"
                time="2 hours ago"
                xp={10}
              />
              <RecentActivityItem
                title="Completed Coffee Goal week 1"
                time="2 hours ago"
                xp={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
