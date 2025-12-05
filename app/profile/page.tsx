"use client";

import React, { useState } from "react";

// react-icons
import { MdEmail, MdLock, MdEdit } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";

import StatCard from "@/components/gloabalComponents/StatCards";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";
import { useCurrentUser } from "@/hooks/useAuth";

// XP → Title Logic
function getXpTitle(xp: number) {
  if (xp <= 0) return "Beginner";
  if (xp <= 1000) return "Bronze";
  if (xp <= 2000) return "Silver";
  if (xp <= 3000) return "Gold";
  if (xp <= 4000) return "Platinum";
  if (xp <= 5000) return "Ruby";
  if (xp <= 7000) return "Emerald";
  return "Diamond";
}

export default function Profile() {
  const [isLinked, setIsLinked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading, error } = useCurrentUser();

  const handleToggleLink = () => setIsLinked(!isLinked);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load user</p>;

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="flex gap-8 items-center">
        {/* Profile Image */}
        <div className="size-48 overflow-hidden rounded-full bg-white" />

        <div className="flex flex-col justify-center gap-2">
          {/* USER NAME */}
          <h1 className="text-5xl font-medium tracking-wide">{user?.name}</h1>

          {/* XP TITLE */}
          <p className="text-gray-200 text-2xl tracking-wide">
            {getXpTitle(user?.total_xp ?? 0)}
          </p>
        </div>
      </div>

      {/* Email + Password */}
      <div className="grid grid-cols-5 gap-6 mt-10">
        {/* Email */}
        <div className="bg-accentBG flex items-center gap-3 px-6 py-4 rounded-full col-span-2">
          <MdEmail className="size-8" />
          <input
            type="text"
            value={user?.email ?? ""}
            readOnly
            className="bg-transparent outline-none text-xl w-full"
          />
        </div>

        {/* Password */}
        <div className="bg-accentBG flex items-center gap-3 px-6 pr-3 py-2 rounded-full col-span-2">
          <MdLock className="size-8" />

          <input
            type={showPassword ? "text" : "password"}
            value={showPassword ? "••••••••••••" : "************"}
            readOnly
            className="bg-transparent outline-none w-full text-xl"
          />

          <VscEyeClosed
            className="size-8 text-white cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />

          {/* Edit Password */}
          <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12 px-3 cursor-pointer">
            <MdEdit className="text-white size-7" />
          </div>
        </div>
      </div>

      {/* Linked Account Section */}
      <div className="grid grid-cols-7 gap-6 mt-10">
        <div className="bg-linear-to-br from-[#1b1b1b] to-[#0e0e0e] p-6 rounded-2xl col-span-3 relative">
          <div>
            <p className="text-gray-400 tracking-widest">
              {isLinked ? "XXXX XXXX 1234" : "Link Account"}
            </p>
            <p className="text-yellow-400 font-medium mt-1">
              {isLinked ? user?.name : "No username"}
            </p>
          </div>

          <button
            onClick={handleToggleLink}
            className={`absolute bottom-6 right-6 px-4 py-2 rounded-full transition border ${
              isLinked
                ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {isLinked ? "Unlink Account" : "Link Account"}
          </button>
        </div>

        {/* Expenses */}
        <div className="col-span-2">
          <StatCard type="expense" value={86.85} />
        </div>

        {/* Income */}
        <div className="col-span-2">
          <StatCard type="income" value={86.85} />
        </div>
      </div>

      {/* Achievements */}
      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-medium tracking-wide">Achievements</h2>
        <button className="text-primary text-lg">view all</button>
      </div>

      <div className="grid grid-cols-6 gap-6 mt-4 overflow-x-auto">
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
        <AchievementCard title="Big Saver" subtitle="Save $500 total" />
      </div>
    </div>
  );
}
