"use client";

import { AiOutlineTransaction } from "react-icons/ai";
import { useState } from "react";
import { Select } from "antd";
import LineChart from "@/components/gloabalComponents/LineChart";
import StatCard from "@/components/gloabalComponents/StatCards";
import { SuggestionCard } from "@/components/gloabalComponents/SuggestionCard";
import { ActiveGoal } from "@/components/gloabalComponents/ActiveGoal";

type Period = "weekly" | "monthly" | "yearly";
type BarData = { label: string; value: number };

export default function Dashboard() {
  const [lineChartPeriod, setLineChartPeriod] = useState<Period>("monthly");

  const yearlyTransactionData: BarData[] = [
    { label: "2015", value: 580 },
    { label: "2016", value: 400 },
    { label: "2017", value: 250 },
    { label: "2018", value: 720 },
    { label: "2019", value: 490 },
    { label: "2020", value: 256 },
    { label: "2021", value: 280 },
    { label: "2022", value: 560 },
    { label: "2023", value: 640 },
  ];

  const monthlyTransactionData: BarData[] = [
    { label: "Jan", value: 50 },
    { label: "Feb", value: 45 },
    { label: "Mar", value: 60 },
    { label: "Apr", value: 70 },
    { label: "May", value: 55 },
    { label: "Jun", value: 65 },
    { label: "Jul", value: 75 },
    { label: "Aug", value: 80 },
    { label: "Sep", value: 90 },
    { label: "Oct", value: 100 },
    { label: "Nov", value: 85 },
    { label: "Dec", value: 95 },
  ];

  const weeklyTransactionData: BarData[] = [
    { label: "Week 1", value: 10 },
    { label: "Week 2", value: 15 },
    { label: "Week 3", value: 20 },
    { label: "Week 4", value: 25 },
  ];

  const yearlyBalanceData = yearlyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 50,
  }));
  const monthlyBalanceData = monthlyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 10,
  }));
  const weeklyBalanceData = weeklyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 2,
  }));

  const generateLineSeries = (transaction: BarData[], balance: BarData[]) => [
    {
      id: "income",
      data: transaction.map((d) => ({ x: d.label, y: d.value })),
    },
    { id: "expense", data: balance.map((d) => ({ x: d.label, y: d.value })) },
  ];

  const yearlyLineSeries = generateLineSeries(
    yearlyTransactionData,
    yearlyBalanceData
  );
  const monthlyLineSeries = generateLineSeries(
    monthlyTransactionData,
    monthlyBalanceData
  );
  const weeklyLineSeries = generateLineSeries(
    weeklyTransactionData,
    weeklyBalanceData
  );

  return (
    <div className="p-6 grid grid-cols-12 gap-6  min-h-screen">
      {/* LEFT MAIN (8) */}
      <div className="col-span-9 space-y-10">
        {/* LINE CHART */}
        <div className="bg-secondaryBG rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <AiOutlineTransaction className="text-white size-10" />
              </div>
              <h3 className="text-lg font-medium">Cashflow Statistics</h3>
            </div>

            <Select
              value={lineChartPeriod}
              onChange={setLineChartPeriod}
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ]}
              className="custom-select"
            />
          </div>

          <LineChart
            series={
              lineChartPeriod === "yearly"
                ? yearlyLineSeries
                : lineChartPeriod === "monthly"
                ? monthlyLineSeries
                : weeklyLineSeries
            }
          />

          <div className="flex gap-6 mt-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-sm bg-[#2ecc71]" />
              <span className="text-sm text-gray-300">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 rounded-sm bg-[#e74c3c]" />
              <span className="text-sm text-gray-300">Expense</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 space-y-10">
        <div className="grid grid-rows-3 gap-6">
          <StatCard type="balance" value={8608.85} />
          <StatCard type="expense" value={86.85} />
          <StatCard type="income" value={86.85} />
        </div>
      </div>

      <div className="col-span-12 grid grid-cols-3 gap-6">
        {/* SUGGESTIONS */}
        <section className="flex flex-col">
          <p className="text-2xl tracking-wide font-medium mb-4">Suggestions</p>
          <div className="grid grid-rows-none gap-4">
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
            <SuggestionCard
              title="Grocery Alert:"
              message="At this pace, you may exceed your shopping budget by $180 (30%). Cut non-essentials to stay on track."
            />
          </div>
        </section>

        {/* ACTIVE GOALS (2/3 WIDTH) */}
        <section className="flex flex-col col-span-2">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl tracking-wide font-medium">Active Goals</p>
          </div>

          <div className="grid grid-rows-none gap-4">
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
          </div>
        </section>
      </div>
    </div>
  );
}
