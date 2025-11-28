"use client";

import React, { useState } from "react";

import { Select } from "antd";
import { FaExchangeAlt, FaBalanceScale } from "react-icons/fa";
import BarChart from "@/components/gloabalComponents/BarChart";
import LineChart from "@/components/gloabalComponents/LineChart";
import PieChart from "@/components/gloabalComponents/PieChart";
import { AiOutlineTransaction } from "react-icons/ai";
import Image from "next/image";

const expenseColors = ["#8E0D28", "#B12434", "#D54654", "#F08B84", "#F4C9B9"];
const incomeColors = ["#125C3E", "#1E7B53", "#47A56C", "#7DCF9A", "#C7F5D6"];

type Period = "weekly" | "monthly" | "yearly";
type BarData = { label: string; value: number };

export default function Home() {
  const [period, setPeriod] = useState<Period>("yearly");
  const [lineChartPeriod, setLineChartPeriod] = useState<Period>("monthly");

  // --- BAR DATA ---
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

  const yearlyBalanceData: BarData[] = yearlyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 50,
  }));
  const monthlyBalanceData: BarData[] = monthlyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 10,
  }));
  const weeklyBalanceData: BarData[] = weeklyTransactionData.map((d) => ({
    label: d.label,
    value: d.value - 2,
  }));

  // --- LINE SERIES ---
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

  // --- PIE DATA ---
  const pieExpense = [
    { id: "Shopping", label: "Shopping", value: 30 },
    { id: "Food", label: "Food", value: 20 },
    { id: "Rent", label: "Rent", value: 25 },
    { id: "Bills", label: "Bills", value: 15 },
    { id: "Other", label: "Other", value: 10 },
  ];

  const pieIncome = [
    { id: "Salary", label: "Salary", value: 40 },
    { id: "Investments", label: "Investments", value: 25 },
    { id: "Freelance", label: "Freelance", value: 15 },
    { id: "Gifts", label: "Gifts", value: 10 },
    { id: "Other", label: "Other", value: 10 },
  ];

  return (
    <div className="min-h-screen space-y-6 p-6">
      <div className="grid grid-cols-2 gap-x-6 ">
        {/* Transaction Summary */}
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

        {/* Balance Summary */}
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

      <div className="bg-secondaryBG rounded-2xl p-8 space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3 mr-4">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center ">
              <AiOutlineTransaction size={40} className="text-white" />
            </div>
            <h3 className="text-lg font-medium">Cashflow Statistics</h3>
          </div>
          <Select
            value={period}
            onChange={setPeriod}
            options={[
              { value: "yearly", label: "Yearly" },
              { value: "monthly", label: "Monthly" },
              { value: "weekly", label: "Weekly" },
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

      <div className="grid grid-cols-2 gap-6 justify-center items-center">
        {/* Expense */}
        <div className="bg-secondaryBG rounded-2xl p-6 flex gap-6">
          <div className="">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <Image
                  src="/expense.svg"
                  alt="Expense Icon"
                  width={24}
                  height={24}
                  className="size-8"
                />{" "}
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
                    <div className="text-xs text-gray-400">{p.value}%</div>
                  </div>
                </div>
                <div className="text-sm">$600</div>
              </div>
            ))}
          </div>
        </div>

        {/* Income */}
        <div className="bg-secondaryBG rounded-2xl p-6  flex gap-6">
          <div className="">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                <Image
                  src="/income.svg"
                  alt="Income Icon"
                  width={24}
                  height={24}
                  className="size-8"
                />{" "}
              </div>
              <h3 className="text-lg font-medium">Income Category Chart</h3>
            </div>
            <PieChart data={pieIncome} colors={incomeColors} />
          </div>
          <div className="w-3/7 flex flex-col justify-center mt-8 ml-16">
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
                    <div className="text-xs text-gray-400">{p.value}%</div>
                  </div>
                </div>
                <div className="text-sm">$600</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
