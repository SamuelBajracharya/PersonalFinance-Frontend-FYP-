"use client";

import { AiOutlineTransaction } from "react-icons/ai";
import { useState, useEffect } from "react";
import { Select } from "antd";
import LineChart from "@/components/gloabalComponents/LineChart";
import StatCard from "@/components/gloabalComponents/StatCards";
import { SuggestionCard } from "@/components/gloabalComponents/SuggestionCard";
import { ActiveGoal } from "@/components/gloabalComponents/ActiveGoal";
import { useFetchDashboard } from "@/hooks/useDashboard";
import { useBankOverlay } from "@/stores/useBankOverlay";
import { useNabilAccountStore } from "@/stores/useNabilAccountStore";

type Period = "weekly" | "monthly" | "yearly";

export default function Dashboard() {
  const [lineChartPeriod, setLineChartPeriod] = useState<Period>("monthly");
  const { isBankLinked, initialize } = useBankOverlay();
  const nabilAccountId = useNabilAccountStore((state) => state.nabilAccountId);

  const { mutate: fetchDashboard, data } = useFetchDashboard();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isBankLinked && nabilAccountId) {
      fetchDashboard(nabilAccountId);
    }
  }, [isBankLinked, nabilAccountId, fetchDashboard]);

  // Extract data safely
  const summary = data?.summary;
  const yearlySeries = data?.yearlyLineSeries ?? [];
  const monthlySeries = data?.monthlyLineSeries ?? [];
  const weeklySeries = data?.weeklyLineSeries ?? [];

  const currentSeries =
    lineChartPeriod === "yearly"
      ? yearlySeries
      : lineChartPeriod === "monthly"
        ? monthlySeries
        : weeklySeries;

  return (
    <div className="p-6 grid grid-cols-12 gap-6 min-h-screen">
      {/* LEFT MAIN (Charts) */}
      <div className="col-span-9 space-y-10">
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
              defaultValue="monthly"
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ]}
              className="custom-select"
            />
          </div>

          {/* LINE CHART */}
          <LineChart series={currentSeries} />

          {/* Legend */}
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

      {/* RIGHT SIDE (Stats) */}
      <div className="col-span-3 space-y-10">
        <div className="grid grid-rows-3 gap-6">
          <StatCard type="balance" value={Number(summary?.totalBalance ?? 0)} />
          <StatCard
            type="expense"
            value={Number(summary?.totalExpenses ?? 0)}
          />
          <StatCard type="income" value={Number(summary?.totalIncome ?? 0)} />
        </div>
      </div>

      {/* Suggestions & Active Goals (unchanged) */}
      <div className="col-span-12 grid grid-cols-3 gap-6">
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
          </div>
        </section>

        <section className="flex flex-col col-span-2">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl tracking-wide font-medium">Active Goals</p>
          </div>

          <div className="grid grid-rows-none gap-4">
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
            <ActiveGoal title="Food and Dining" saved={16} target={40} />
          </div>
        </section>
      </div>
    </div>
  );
}
