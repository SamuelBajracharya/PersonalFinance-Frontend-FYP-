"use client";

import React, { useEffect, useState } from "react";
import { Select, message } from "antd";
import { FaExchangeAlt, FaBalanceScale } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import Image from "next/image";

import BarChart from "@/components/gloabalComponents/BarChart";
import LineChart from "@/components/gloabalComponents/LineChart";
import PieChart from "@/components/gloabalComponents/PieChart";
import { useFetchAnalytics } from "@/hooks/useAnalytics";
import { useNabilBankAccount } from "@/hooks/useBankTransaction";
import { useBankOverlay } from "@/stores/useBankOverlay";

// Colors
const expenseColors = ["#8E0D28", "#B12434", "#D54654", "#F08B84", "#F4C9B9"];
const incomeColors = ["#125C3E", "#1E7B53", "#47A56C", "#7DCF9A", "#C7F5D6"];

type Period = "weekly" | "monthly" | "yearly";

export default function Home() {
  const [period, setPeriod] = useState<Period>("yearly");
  const [lineChartPeriod, setLineChartPeriod] = useState<Period>("monthly");
  const { isBankLinked, initialize } = useBankOverlay();
  const { data: account } = useNabilBankAccount(isBankLinked);

  const { mutate: fetchAnalytics, data, isPending } = useFetchAnalytics();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isBankLinked || !account?.id) return;

    fetchAnalytics(account.id, {
      onError: () => message.error("Failed to load analytics."),
    });
  }, [isBankLinked, account?.id, fetchAnalytics]);

  const api = data || {};
  console.log("Analytics API Data:", api);

  const yearlyTransactionData = api.yearlyTransactionData || [];
  const monthlyTransactionData = api.monthlyTransactionData || [];
  const weeklyTransactionData = api.weeklyTransactionData || [];

  const yearlyBalanceData = api.yearlyBalanceData || [];
  const monthlyBalanceData = api.monthlyBalanceData || [];
  const weeklyBalanceData = api.weeklyBalanceData || [];

  const yearlyLineSeries = api.yearlyLineSeries || [];
  const monthlyLineSeries = api.monthlyLineSeries || [];
  const weeklyLineSeries = api.weeklyLineSeries || [];

  const pieExpense = api.pieExpense || [];
  const pieIncome = api.pieIncome || [];

  return (
    <div className="min-h-screen space-y-6 p-6">
      {isPending && (
        <div className="text-center text-primary text-lg font-medium">
          Loading analytics...
        </div>
      )}

      {/* TRANSACTION SUMMARY */}
      <div className="grid grid-cols-2 gap-x-6">
        <div className="bg-secondaryBG rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <FaExchangeAlt size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium">Total Transaction Summary</h3>
            </div>

            <Select
              value={period}
              onChange={setPeriod}
              options={[
                { value: "yearly", label: "Yearly" },
                { value: "monthly", label: "Monthly" },
                { value: "weekly", label: "Weekly" },
              ]}
              defaultValue="monthly"
              className="custom-select"
            />
          </div>

          <BarChart
            data={
              period === "yearly"
                ? yearlyTransactionData
                : period === "monthly"
                  ? monthlyTransactionData
                  : weeklyTransactionData
            }
            indexBy="label"
            valueKey="value"
          />
        </div>

        {/* BALANCE SUMMARY */}
        <div className="bg-secondaryBG rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <FaBalanceScale size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-medium">Total Balance Summary</h3>
            </div>

            <Select
              value={period}
              onChange={setPeriod}
              options={[
                { value: "yearly", label: "Yearly" },
                { value: "monthly", label: "Monthly" },
                { value: "weekly", label: "Weekly" },
              ]}
              defaultValue="monthly"
              className="custom-select"
            />
          </div>

          <BarChart
            data={
              period === "yearly"
                ? yearlyBalanceData
                : period === "monthly"
                  ? monthlyBalanceData
                  : weeklyBalanceData
            }
            indexBy="label"
            valueKey="value"
          />
        </div>
      </div>

      {/* CASHFLOW LINE CHART */}
      <div className="bg-secondaryBG rounded-2xl p-8 space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3 mr-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
              <AiOutlineTransaction size={40} className="text-white" />
            </div>
            <h3 className="text-lg font-medium">Cashflow Statistics</h3>
          </div>

          <Select
            value={lineChartPeriod}
            onChange={setLineChartPeriod}
            options={[
              { value: "yearly", label: "Yearly" },
              { value: "monthly", label: "Monthly" },
              { value: "weekly", label: "Weekly" },
            ]}
            defaultValue="monthly"
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

      {/* PIE CHARTS */}
      <div className="grid grid-cols-2 gap-6 justify-center items-center">
        {/* EXPENSE PIE */}
        <div className="bg-secondaryBG rounded-2xl p-6 flex gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <Image
                  src="/expense.svg"
                  alt="Expense Icon"
                  width={24}
                  height={24}
                  className="size-8"
                />
              </div>
              <h3 className="text-lg font-medium">Expense Category Chart</h3>
            </div>
            <PieChart data={pieExpense} colors={expenseColors} />
          </div>

          <div className="w-3/7 flex flex-col justify-center ml-16 mt-8">
            {pieExpense.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-md"
                    style={{ backgroundColor: expenseColors[i] }}
                  />
                  <div>
                    <div className="text-sm">{p.label}</div>
                    <div className="text-xs text-gray-400">{p.value}</div>
                  </div>
                </div>
                <div className="text-sm">${p.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* INCOME PIE */}
        <div className="bg-secondaryBG rounded-2xl p-6 flex gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <Image
                  src="/income.svg"
                  alt="Income Icon"
                  width={24}
                  height={24}
                  className="size-8"
                />
              </div>
              <h3 className="text-lg font-medium">Income Category Chart</h3>
            </div>
            <PieChart data={pieIncome} colors={incomeColors} />
          </div>

          <div className="w-3/7 flex flex-col justify-center ml-16 mt-8">
            {pieIncome.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-md"
                    style={{ backgroundColor: incomeColors[i] }}
                  />
                  <div>
                    <div className="text-sm">{p.label}</div>
                    <div className="text-xs text-gray-400">{p.value}</div>
                  </div>
                </div>
                <div className="text-sm">${p.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
