"use client";

import BarChart from "@/components/gloabalComponents/BarChart";
import { CoffeeSpendingCard } from "@/components/gloabalComponents/CoffeeSpendingCard";
import React from "react";
// Changed to react-icons
import { BsFileText, BsPlus } from "react-icons/bs";

const chartData = [
  { day: "M", amount: 55 },
  { day: "T", amount: 20 },
  { day: "W", amount: 58 },
  { day: "T", amount: 68 },
  { day: "F", amount: 25 },
  { day: "S", amount: 60 },
  { day: "S", amount: 95 },
];

export default function BudgetGoals() {
  return (
    <div className="min-h-screen p-6 font-sans text-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mx-auto">
        {/* --- LEFT COLUMN (List) --- */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <CoffeeSpendingCard isActive={true} />
          <CoffeeSpendingCard />
          <CoffeeSpendingCard />
          <CoffeeSpendingCard />
        </div>

        {/* --- RIGHT COLUMN (Details) --- */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent rounded-xl text-white">
                <BsFileText size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Coffee Spending
              </h2>
            </div>
            {/* 1. AI Suggestion Card */}
            <div className="bg-secondaryBG p-6 rounded-2xl">
              <h3 className="text-white text-xl font-medium mb-2">
                AI Suggestion & Forcast
              </h3>
              <p className="text-gray-300 !text-[16px] mb-6 leading-relaxed">
                If you continue spending on shopping like last week, you could
                overshoot your budget by around $180 (30%). Consider reducing
                non-essential buys to stay on target.
              </p>

              <div className="bg-accentBG w-fit px-4 py-3 rounded-xl border-l-4 border-accent">
                <p className="text-textmain text-sm uppercase font-medium mb-1">
                  Predicted Overspend
                </p>
                <p className="text-accent text-2xl font-bold">$2.00</p>
              </div>
            </div>
          </div>

          {/* 2. Pace & Prediction Card */}
          <div className="bg-secondaryBG p-6 rounded-2xl">
            <h3 className="text-white text-xl font-medium mb-6">
              Pace & Prediction
            </h3>

            <div className="space-y-6">
              {/* Bar 1: Current */}
              <div>
                <div className="flex justify-between text-lg mb-2">
                  <span className="text-white">Current Spendings</span>
                  <span className="text-gray-400">$10 / $20 (50%)</span>
                </div>
                <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full"></div>
                </div>
              </div>

              {/* Bar 2: Predicted */}
              <div>
                <div className="flex justify-between text-lg mb-2">
                  <span className="text-white">AI Predicted Spendings</span>
                  <span className="text-gray-400">$24 / $20 (120%)</span>
                </div>
                <div className="h-3 w-full bg-gray-800 rounded-full relative overflow-hidden">
                  <div className="h-full bg-accent w-[120%] rounded-full absolute top-0 left-0"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Spending History */}
          <div className="bg-secondaryBG p-6 rounded-2xl">
            <h3 className="text-white text-xl font-medium mb-4">
              Spending History
            </h3>
            <BarChart data={chartData} indexBy="day" valueKey="amount" />
          </div>
        </div>
      </div>
    </div>
  );
}
