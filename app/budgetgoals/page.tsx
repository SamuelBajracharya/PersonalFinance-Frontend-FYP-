"use client";

import React, { useState } from "react";
import BarChart from "@/components/gloabalComponents/BarChart";
import { CoffeeSpendingCard } from "@/components/gloabalComponents/CoffeeSpendingCard";
import { BsFileText, BsPlus } from "react-icons/bs";
import { useMyBudgets } from "@/hooks/useBudgetGoals";
import { useCreateBudgetOverlay } from "@/stores/useCreateBudgetOverlay";
import CreateBudgetOverlay from "@/components/gloabalComponents/CreateBudgetOverlay";
import { useBudgetPredictions } from "@/hooks/useBudgetPrediction";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

export default function BudgetGoals() {
  const { data: budgets = [], isLoading } = useMyBudgets();
  const { data: predictions = [], isLoading: isPredictionLoading } =
    useBudgetPredictions();
  const showLoadingOverlay = isLoading || isPredictionLoading;
  const showInitialSkeletons =
    showLoadingOverlay && budgets.length === 0 && predictions.length === 0;

  const { isCreateBudgetOpen, openCreateBudget } = useCreateBudgetOverlay();

  // Track selected category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter predictions based on selected category
  const filteredPredictions = selectedCategory
    ? predictions.filter((p) => p.category === selectedCategory)
    : predictions;

  // Derive chart data from filtered predictions
  const chartData = filteredPredictions.map((p) => ({
    day: p.category,
    amount: Number(p.predicted_amount),
  }));

  // Derive totals for selected category
  const totalPredictedSpend = filteredPredictions.reduce(
    (sum, p) => sum + Number(p.predicted_amount),
    0,
  );

  const totalRemainingBudget = filteredPredictions.reduce(
    (sum, p) => sum + Number(p.remaining_budget),
    0,
  );

  const predictedOverspend = Math.max(
    totalPredictedSpend - totalRemainingBudget,
    0,
  );

  // Current spending = budget_amount - remaining_budget
  const currentSpending = budgets
    .filter((b) => b.category === selectedCategory)
    .reduce(
      (sum, b) => sum + (Number(b.budget_amount) - Number(b.remaining_budget)),
      0,
    );

  return (
    <div className="min-h-screen p-6 font-sans text-gray-200">
      {/* Create Budget Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openCreateBudget}
          className="flex items-center gap-2 bg-primary px-6 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition"
        >
          <BsPlus size={20} />
          Create New Budget
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mx-auto">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {showInitialSkeletons &&
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className="h-[170px] rounded-2xl bg-secondaryBG"
              />
            ))}

          {!showInitialSkeletons && !isLoading && budgets.length === 0 && (
            <p className="text-gray-400 text-center py-6">
              No budgets created yet.
            </p>
          )}

          {!showInitialSkeletons && budgets.map((budget) => (
            <CoffeeSpendingCard
              key={budget.id}
              category={budget.category}
              budgetAmount={Number(budget.budget_amount)}
              startDate={budget.start_date}
              endDate={budget.end_date}
              isActive={budget.category === selectedCategory}
              onClick={() => setSelectedCategory(budget.category)}
            />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent rounded-xl text-white">
              <BsFileText size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Budget Details
            </h2>
          </div>

          <div className="bg-secondaryBG p-6 rounded-2xl">
            {showInitialSkeletons ? (
              <>
                <SkeletonBlock className="h-7 w-56" />
                <SkeletonBlock className="h-5 w-80 mt-2" />
                <SkeletonBlock className="h-16 w-44 mt-6 rounded-xl" />
              </>
            ) : (
              <>
                <h3 className="text-white text-xl font-medium mb-2">
                  AI Suggestion & Forecast
                </h3>
                <p className="text-gray-300 text-[16px] mb-6 leading-relaxed">
                  AI-generated insights for {selectedCategory || "all categories"}.
                </p>

                <div className="bg-accentBG w-fit px-4 py-3 rounded-xl border-l-4 border-accent">
                  <p className="text-textmain text-sm uppercase font-medium mb-1">
                    Predicted Overspend
                  </p>
                  <p className="text-accent text-2xl font-bold">
                    NPR {predictedOverspend.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="bg-secondaryBG p-6 rounded-2xl">
            {showInitialSkeletons ? (
              <>
                <SkeletonBlock className="h-7 w-48 mb-6" />
                <SkeletonBlock className="h-6 w-full mb-2" />
                <SkeletonBlock className="h-3 w-full rounded-full mb-6" />
                <SkeletonBlock className="h-6 w-full mb-2" />
                <SkeletonBlock className="h-3 w-full rounded-full" />
              </>
            ) : (
              <>
                <h3 className="text-white text-xl font-medium mb-6">
                  Pace & Prediction
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-lg mb-2">
                      <span>Current Spendings</span>
                      <span className="text-gray-400">
                        NPR {currentSpending.toFixed(0)} / NPR{" "}
                        {totalRemainingBudget.toFixed(0)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${totalRemainingBudget
                              ? Math.min(
                                (currentSpending / totalRemainingBudget) * 100,
                                100,
                              )
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-lg mb-2">
                      <span>AI Predicted Spendings</span>
                      <span className="text-gray-400">
                        NPR {totalPredictedSpend.toFixed(0)} / NPR{" "}
                        {totalRemainingBudget.toFixed(0)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{
                          width: `${totalRemainingBudget
                              ? Math.min(
                                (totalPredictedSpend / totalRemainingBudget) *
                                100,
                                100,
                              )
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-secondaryBG p-6 rounded-2xl">
            {showInitialSkeletons ? (
              <>
                <SkeletonBlock className="h-7 w-44 mb-4" />
                <SkeletonBlock className="h-[320px] w-full rounded-xl bg-highlight" />
              </>
            ) : (
              <>
                <h3 className="text-white text-xl font-medium mb-4">
                  Spending History
                </h3>

                <BarChart data={chartData} indexBy="day" valueKey="amount" />
              </>
            )}
          </div>
        </div>
      </div>

      <LoadingOverlay show={showLoadingOverlay} />

      {/* Overlay */}
      {isCreateBudgetOpen && <CreateBudgetOverlay />}
    </div>
  );
}
