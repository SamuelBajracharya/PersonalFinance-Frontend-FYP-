"use client";

import React, { useState } from "react";

// react-icons
import { MdEmail, MdLock, MdEdit } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import StatCard from "@/components/gloabalComponents/StatCards";
import AchievementCard from "@/components/gloabalComponents/AchievementCard";

export default function Profile() {
  const [isLinked, setIsLinked] = useState(true);

  const handleToggleLink = () => {
    setIsLinked(!isLinked);
  };

  return (
    <div className=" p-6">
      {/* Top Section */}
      <div className="flex gap-8 items-center">
        {/* Profile Image */}
        <div className="size-48 overflow-hidden rounded-full bg-white" />

        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-5xl font-medium tracking-wide">
            Samuel Bajracharya
          </h1>
          <p className="text-gray-200 text-2xl tracking-wide">Silver Saver</p>
        </div>
      </div>

      {/* Email + Password */}
      <div className="grid grid-cols-5 gap-6 mt-10">
        {/* Email */}
        <div className="bg-accentBG flex items-center gap-3 px-6 py-4 rounded-full col-span-2">
          <MdEmail className="size-8" />
          <input
            type="text"
            value="samuel@gmail.com"
            readOnly
            className="bg-transparent outline-none text-xl w-full"
          />
        </div>

        {/* Password */}
        <div className="bg-accentBG flex items-center gap-3 px-6 pr-3 py-2 rounded-full col-span-2">
          <MdLock className="size-8" />

          <input
            type="password"
            value="************"
            readOnly
            className="bg-transparent outline-none w-full text-xl"
          />

          <VscEyeClosed className="size-8 text-white" />

          {/* Edit icon inside blue circle */}
          <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12 px-3">
            <MdEdit className="text-white size-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-6 mt-10">
        <div className="bg-linear-to-br from-[#1b1b1b] to-[#0e0e0e] p-6 rounded-2xl col-span-3 relative">
          {/* Left Text */}
          <div>
            <p className="text-gray-400 tracking-widest">
              {isLinked ? "XXXX XXXX 1234" : "Link Account"}
            </p>
            <p className="text-yellow-400 font-medium mt-1">
              {isLinked ? "Samuel Bajracharya" : "No username"}
            </p>
          </div>

          {/* Bottom Right Button */}
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
        {/* Incomes */}
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
