"use client";

import { useState, useEffect, useRef } from "react";
import { Select, Tour } from "antd";
import Link from "next/link";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaChartPie } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";
import LineChart from "@/components/gloabalComponents/LineChart";
import PieChart from "@/components/gloabalComponents/PieChart";
import StatCard from "@/components/gloabalComponents/StatCards";
import { SuggestionCard } from "@/components/gloabalComponents/SuggestionCard";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import DashboardRecentTransactions from "@/components/gloabalComponents/DashboardRecentTransactions";
import DashboardBudgetGoals from "@/components/gloabalComponents/DashboardBudgetGoals";
import DashboardStockPrediction from "@/components/gloabalComponents/DashboardStockPrediction";
import DashboardAIAssistant from "@/components/gloabalComponents/DashboardAIAssistant";
import { useFetchDashboard } from "@/hooks/useDashboard";
import { useBankOverlay } from "@/stores/useBankOverlay";
import { useNabilAccountStore } from "@/stores/useNabilAccountStore";
import { useTourStore } from "@/stores/useTour";

type Period = "weekly" | "monthly" | "yearly";

interface DashboardPoint {
  x: string | number;
  y: string | number;
}

interface DashboardLineSeries {
  id: string;
  data: DashboardPoint[];
}

interface DashboardSummary {
  totalIncome: string;
  totalExpenses: string;
  totalBalance: string;
  savingRate: string;
}

interface RecentTransaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  category: string;
  description: string;
  merchant: string;
}

interface TopBudgetGoal {
  id: string;
  category: string;
  budgetAmount: string;
  spentAmount: string;
  remainingBudget: string;
  usagePct: string;
  status: string;
}

interface TopStock {
  id: string;
  symbol: string;
  name: string;
  quantity: string;
  currentPrice: string;
  averageBuyPrice: string;
  marketValue: string;
}

interface AISuggestion {
  category: string;
  suggestion: string;
}

interface ExpenseCategoryPoint {
  id: string;
  label: string;
  value: string;
}

interface DashboardResponse {
  summary?: DashboardSummary;
  yearlyLineSeries?: DashboardLineSeries[];
  monthlyLineSeries?: DashboardLineSeries[];
  weeklyLineSeries?: DashboardLineSeries[];
  recentTransactions?: RecentTransaction[];
  topBudgetGoals?: TopBudgetGoal[];
  topStocks?: TopStock[];
  aiSuggestions?: AISuggestion[];
  cashflowStatistics?: DashboardLineSeries[];
  monthlyExpenseCategoryChart?: ExpenseCategoryPoint[];
  yearlyExpenseCategoryChart?: ExpenseCategoryPoint[];
  expenseCategoryChart?: ExpenseCategoryPoint[];
}

export default function Dashboard() {
  const [lineChartPeriod, setLineChartPeriod] = useState<Period>("monthly");
  const { isBankLinked, initialize } = useBankOverlay();
  const {
    isDashboardTour,
    initialize: initializeTour,
    setDashboardTour,
  } = useTourStore();
  const nabilAccountId = useNabilAccountStore((state) => state.nabilAccountId);

  const statsRef = useRef<HTMLDivElement>(null);
  const recentTransactionsRef = useRef<HTMLDivElement>(null);
  const budgetGoalsRef = useRef<HTMLDivElement>(null);
  const stockPredictionRef = useRef<HTMLDivElement>(null);
  const aiAssistantRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const cashflowRef = useRef<HTMLDivElement>(null);
  const expenseCategoryRef = useRef<HTMLDivElement>(null);

  const { mutate: fetchDashboard, data, isPending } = useFetchDashboard();

  const dashboardData = (data as DashboardResponse | undefined) ?? {};

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    initializeTour();
  }, [initializeTour]);

  useEffect(() => {
    if (isBankLinked && nabilAccountId) {
      fetchDashboard(nabilAccountId);
    }
  }, [isBankLinked, nabilAccountId, fetchDashboard]);

  const summary = dashboardData.summary;
  const yearlySeries = dashboardData.yearlyLineSeries ?? [];
  const monthlySeries = dashboardData.monthlyLineSeries ?? [];
  const weeklySeries = dashboardData.weeklyLineSeries ?? [];

  const currentSeries =
    lineChartPeriod === "yearly"
      ? yearlySeries
      : lineChartPeriod === "monthly"
        ? monthlySeries
        : weeklySeries;

  const normalizedCurrentSeries = currentSeries.map((series) => ({
    ...series,
    data: (series.data ?? []).map((point) => ({
      x: point.x,
      y: Number(point.y || 0),
    })),
  }));

  const cashflowSeries = (dashboardData.cashflowStatistics ?? []).map((series) => ({
    ...series,
    data: (series.data ?? []).map((point) => ({
      x: point.x,
      y: Number(point.y || 0),
    })),
  }));

  const expenseCategorySource =
    dashboardData.expenseCategoryChart ??
    (lineChartPeriod === "yearly"
      ? dashboardData.yearlyExpenseCategoryChart
      : dashboardData.monthlyExpenseCategoryChart) ??
    dashboardData.monthlyExpenseCategoryChart ??
    dashboardData.yearlyExpenseCategoryChart ??
    [];

  const expensePieData = expenseCategorySource.map((item) => ({
    id: item.id,
    label: item.label,
    value: Number(item.value || 0),
  }));

  const pieColors = ["#B91C48", "#E11D48", "#FB7185", "#FBCFE8", "#FDE68A"];

  const savingRateValue = Number(summary?.savingRate ?? 0);
  const suggestionItems = dashboardData.aiSuggestions ?? [];
  const showLoadingOverlay = isPending;
  const showInitialSkeletons = isPending && !dashboardData.summary;
  const shouldOpenTour = isDashboardTour && !showInitialSkeletons;

  const tourSteps = [
    {
      title: "Dashboard Summary Stats",
      description:
        "These four cards show your current balance, expenses, income, and saving rate at a glance.",
      target: statsRef.current ?? undefined,
    },
    {
      title: "Recent Transactions",
      description:
        "Review your latest transaction activity here and use View All for full history.",
      target: recentTransactionsRef.current ?? undefined,
    },
    {
      title: "Budget Goals",
      description:
        "Track category-wise budget progress and see which goals are on track or at risk.",
      target: budgetGoalsRef.current ?? undefined,
    },
    {
      title: "Stock Prediction",
      description:
        "Get quick insights into tracked stocks, trend direction, and price movement.",
      target: stockPredictionRef.current ?? undefined,
    },
    {
      title: "AI Assistant",
      description:
        "Ask budgeting, saving, and spending questions here for contextual AI guidance.",
      target: aiAssistantRef.current ?? undefined,
    },
    {
      title: "AI Suggestions",
      description:
        "Personalized recommendation cards generated from your current financial data.",
      target: suggestionsRef.current ?? undefined,
    },
    {
      title: "Cashflow Statistics",
      description:
        "Visualize income vs expense trends over weekly, monthly, or yearly periods.",
      target: cashflowRef.current ?? undefined,
    },
    {
      title: "Expense Category Chart",
      description:
        "Understand how your spending is distributed across categories.",
      target: expenseCategoryRef.current ?? undefined,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      {showInitialSkeletons ? (
        <>
          <section ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[152px] rounded-2xl" />
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:h-[560px]">
            <SkeletonBlock className="xl:col-span-4 h-full rounded-2xl" />
            <div className="xl:col-span-4 grid grid-rows-2 gap-3 h-full">
              <SkeletonBlock className="h-full rounded-2xl" />
              <SkeletonBlock className="h-full rounded-2xl" />
            </div>
            <SkeletonBlock className="xl:col-span-4 h-full rounded-2xl" />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-[140px] rounded-2xl" />
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <SkeletonBlock className="xl:col-span-6 h-[430px] rounded-2xl" />
            <SkeletonBlock className="xl:col-span-6 h-[430px] rounded-2xl" />
          </section>
        </>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard type="balance" value={Number(summary?.totalBalance ?? 0)} disabled={isPending || !isBankLinked} />
            <StatCard type="expense" value={Number(summary?.totalExpenses ?? 0)} disabled={isPending || !isBankLinked} />
            <StatCard type="income" value={Number(summary?.totalIncome ?? 0)} disabled={isPending || !isBankLinked} />

            <div className="bg-secondaryBG rounded-2xl flex items-center justify-between px-6 py-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary rounded-2xl p-2">
                    <TbPigMoney className="size-8 text-white" />
                  </div>
                  <p className="text-2xl font-medium">Saving Rate</p>
                </div>
                <p className="text-primary text-xl tracking-wide">
                  {isPending || !isBankLinked ? "N/A" : `${savingRateValue.toFixed(2)}%`}
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:h-[560px] items-stretch overflow-hidden">
            <div ref={recentTransactionsRef} className="xl:col-span-4 bg-secondaryBG rounded-2xl p-4 h-full flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-medium">Recent Transactions</h3>
                <Link href="/transactions" className="text-accent text-sm underline underline-offset-2">
                  view all
                </Link>
              </div>
              <div className="flex-1 min-h-0">
                <DashboardRecentTransactions transactions={dashboardData.recentTransactions ?? []} />
              </div>
            </div>

            <div className="xl:col-span-4 grid grid-rows-2 gap-4 h-full min-h-0 overflow-hidden">
              <div ref={budgetGoalsRef} className="bg-secondaryBG rounded-2xl p-4 h-full min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-medium">Budget Goals</h3>
                  <Link href="/budgetgoals" className="text-accent text-sm underline underline-offset-2">
                    view all
                  </Link>
                </div>
                <DashboardBudgetGoals goals={dashboardData.topBudgetGoals ?? []} />
              </div>

              <div ref={stockPredictionRef} className="bg-secondaryBG rounded-2xl p-4 h-full min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-medium">Stock Prediction</h3>
                  <Link href="/mystocks" className="text-accent text-sm underline underline-offset-2">
                    view all
                  </Link>
                </div>
                <DashboardStockPrediction stocks={dashboardData.topStocks ?? []} />
              </div>
            </div>

            <div ref={aiAssistantRef} className="xl:col-span-4 bg-secondaryBG rounded-2xl p-4 h-full flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-medium">AI Assistant</h3>
                <Link href="/ai-assistant" className="text-accent text-sm underline underline-offset-2">
                  view all
                </Link>
              </div>
              <div className="flex-1 min-h-0">
                <DashboardAIAssistant />
              </div>
            </div>
          </section>

          <section ref={suggestionsRef} className="bg-secondaryBG rounded-2xl p-4">
            <h3 className="text-2xl font-medium mb-3">AI Suggestions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {suggestionItems.length === 0 ? (
                <SuggestionCard
                  title="No Suggestions"
                  message="Link and sync your bank account to receive personalized AI spending suggestions."
                />
              ) : (
                suggestionItems.slice(0, 3).map((item, idx) => (
                  <SuggestionCard
                    key={`${item.category}-${idx}`}
                    title={`${item.category} Alert:`}
                    message={item.suggestion}
                  />
                ))
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div ref={cashflowRef} className="xl:col-span-6 bg-secondaryBG rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                    <AiOutlineTransaction className="text-white size-7" />
                  </div>
                  <h3 className="text-2xl font-medium">Cashflow Statistics</h3>
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

              <LineChart series={cashflowSeries.length ? cashflowSeries : normalizedCurrentSeries} />

              <div className="flex gap-6 mt-2 items-center justify-center">
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

            <div ref={expenseCategoryRef} className="xl:col-span-6 bg-secondaryBG rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                  <FaChartPie className="text-white size-6" />
                </div>
                <h3 className="text-2xl font-medium">Expense Category Chart</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center h-full">
                <div className="w-full flex items-center justify-center">
                  <div className="w-full max-w-[340px]">
                    <PieChart data={expensePieData} colors={pieColors} height={350} />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center gap-3 px-1 md:px-2">
                  {expensePieData.length === 0 ? (
                    <p className="text-textsecondary text-sm">No category distribution found.</p>
                  ) : (
                    expensePieData.map((item, index) => (
                      <button
                        key={item.id}
                        className="flex items-center justify-between text-left hover:bg-white/5 rounded-lg p-2 transition cursor-pointer"
                        type="button"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="size-7 rounded-md shrink-0"
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm truncate">{item.label || item.id}</p>
                            <p className="text-xs text-gray-400">{Number(item.value || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-textmain shrink-0">
                          Rs. {Number(item.value).toFixed(0)}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <LoadingOverlay show={showLoadingOverlay} />
      <Tour
        open={shouldOpenTour}
        onClose={() => setDashboardTour(false)}
        onFinish={() => setDashboardTour(false)}
        steps={tourSteps}
        zIndex={2147483645}
        rootClassName="!z-[2147483645]"
      />
    </div>
  );
}
