"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsFileText, BsPlus } from "react-icons/bs";
import BarChart from "@/components/gloabalComponents/BarChart";
import {
    useBudgetGoalAdaptiveAdjustment,
    useBudgetGoalPeriodReview,
    useBudgetGoalStatuses,
    useBudgetGoalSuggestions,
    useDeleteBudget,
    useBudgetPredictionExplanation,
    useSimulateBudgetGoal,
    useSingleBudgetGoalStatus,
} from "@/hooks/useBudgetGoals";
import { useNabilBankTransactions } from "@/hooks/useBankTransaction";
import { useBankOverlay } from "@/stores/useBankOverlay";
import { useCreateBudgetOverlay } from "@/stores/useCreateBudgetOverlay";
import CreateBudgetOverlay from "@/components/gloabalComponents/CreateBudgetOverlay";
import SimpleConfirmationOverlay from "@/components/gloabalComponents/SimpleConfirmationOverlay";
import { useAntdMessage } from "@/components/gloabalComponents/AntdMessageContext";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

const currency = (value?: number) => `Rs ${Number(value ?? 0).toLocaleString()}`;
const percent = (value?: number) => `${Number(value ?? 0).toFixed(1)}%`;
const clamp = (num: number, min: number, max: number) =>
    Math.max(min, Math.min(num, max));
const formatReadableDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return String(value);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const formatMonthDay = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    return `${month} ${day}`;
};

export default function BudgetGoals() {
    const messageApi = useAntdMessage();
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; budgetId: string | null; category: string | null }>({ open: false, budgetId: null, category: null });
    const { isBankLinked, initialize } = useBankOverlay();
    const { data: statuses = [], isLoading: isStatusesLoading } =
        useBudgetGoalStatuses();
    const { data: transactions = [] } = useNabilBankTransactions(isBankLinked);

    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [reductionPercent, setReductionPercent] = useState<number>(10);
    const [absoluteCut, setAbsoluteCut] = useState<number>(0);
    const [leftListMaxHeight, setLeftListMaxHeight] = useState<number>(0);
    const [leftHeaderHeight, setLeftHeaderHeight] = useState<number>(0);
    const [lastSimulation, setLastSimulation] = useState<null | {
        baseline_projected_spend: number;
        simulated_projected_spend: number;
        projected_savings: number;
        baseline_predicted_to_exceed: boolean;
        simulated_predicted_to_exceed: boolean;
        simulated_remaining_budget: number;
    }>(null);

    const { isCreateBudgetOpen, openCreateBudget } = useCreateBudgetOverlay();
    const { mutate: runSimulation, isPending: isSimulationRunning } =
        useSimulateBudgetGoal();
    const { mutate: deleteBudget, isPending: isDeletingBudget } = useDeleteBudget();
    const rightPanelRef = useRef<HTMLElement | null>(null);
    const leftHeaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        const target = rightPanelRef.current;
        if (!target) return;

        const updateHeight = () => {
            setLeftHeaderHeight(leftHeaderRef.current?.offsetHeight || 0);
            setLeftListMaxHeight(target.offsetHeight || 0);
        };

        updateHeight();

        const observer = new ResizeObserver(() => {
            updateHeight();
        });

        observer.observe(target);
        if (leftHeaderRef.current) {
            observer.observe(leftHeaderRef.current);
        }
        window.addEventListener("resize", updateHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    const selectedStatusFromList = useMemo(
        () =>
            statuses.find((item) => item.budget_id === selectedBudgetId) || statuses[0],
        [statuses, selectedBudgetId],
    );

    const effectiveBudgetId =
        selectedBudgetId || selectedStatusFromList?.budget_id || "";

    const { data: singleStatus } = useSingleBudgetGoalStatus(effectiveBudgetId);
    useBudgetPredictionExplanation(effectiveBudgetId);
    const { data: suggestions } = useBudgetGoalSuggestions(effectiveBudgetId);
    const { data: adaptive } = useBudgetGoalAdaptiveAdjustment(effectiveBudgetId);
    const { data: review } = useBudgetGoalPeriodReview(effectiveBudgetId);

    const selectedStatus = singleStatus || selectedStatusFromList;

    useEffect(() => {
        if (!selectedBudgetId && statuses.length > 0) {
            setSelectedBudgetId(statuses[0].budget_id);
        }
    }, [selectedBudgetId, statuses]);

    useEffect(() => {
        setLastSimulation(null);
    }, [selectedBudgetId]);

    const budgetAmount = Number(selectedStatus?.budget_amount || 0);
    const currentSpend = Number(selectedStatus?.current_spend || 0);
    const projectedSpend = Number(selectedStatus?.projected_period_spend || 0);

    const currentPct = budgetAmount
        ? clamp((currentSpend / budgetAmount) * 100, 0, 100)
        : 0;
    const projectedPct = budgetAmount
        ? clamp((projectedSpend / budgetAmount) * 100, 0, 100)
        : 0;

    const weeklySpendingData = useMemo(() => {
        const msPerDay = 24 * 60 * 60 * 1000;
        const now = Date.now();
        const start = now - 28 * msPerDay;
        const labels = Array.from({ length: 4 }).map((_, idx) => {
            const weekStart = start + idx * 7 * msPerDay;
            const weekEnd = weekStart + 6 * msPerDay;
            return `${formatMonthDay(weekStart)}-${formatMonthDay(weekEnd)}`;
        });
        const category = selectedStatus?.category?.toLowerCase().trim();

        if (!category) {
            return labels.map((week) => ({ week, amount: 0 }));
        }

        const buckets = [0, 0, 0, 0];

        for (const tx of transactions) {
            const txCategory = String(tx.category || "").toLowerCase().trim();
            if (txCategory !== category) continue;

            const txTime = new Date(tx.date).getTime();
            if (!Number.isFinite(txTime) || txTime < start || txTime > now) continue;

            const txType = String(tx.type || "").toLowerCase();
            if (txType.includes("credit") || txType.includes("income")) continue;

            const diffDays = Math.floor((now - txTime) / msPerDay);
            const bucketFromNewest = Math.min(3, Math.floor(diffDays / 7));
            const bucketIndex = 3 - bucketFromNewest;
            buckets[bucketIndex] += Math.abs(Number(tx.amount || 0));
        }

        return labels.map((week, idx) => ({
            week,
            amount: Number(buckets[idx].toFixed(2)),
        }));
    }, [selectedStatus?.category, transactions]);

    const showLoadingOverlay = isStatusesLoading || isSimulationRunning;
    const showInitialSkeletons = isStatusesLoading && statuses.length === 0;

    const onRunSimulation = () => {
        if (!effectiveBudgetId) return;

        runSimulation(
            {
                budgetId: effectiveBudgetId,
                payload: {
                    reduction_percent: Number(reductionPercent || 0),
                    absolute_cut: Number(absoluteCut || 0),
                },
            },
            {
                onSuccess: (result) => {
                    setLastSimulation(result);
                },
            },
        );
    };

    return (
        <div className="min-h-screen p-6 font-sans text-textmain">
            <div className="flex justify-end mb-6">
                <button
                    onClick={openCreateBudget}
                    className="flex items-center gap-2 bg-primary px-6 py-3 rounded-full text-lg font-medium hover:bg-primary/80 transition"
                >
                    <BsPlus size={20} />
                    Create New Budget
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <aside className="lg:col-span-4 self-start flex flex-col h-full min-h-0">
                    <div ref={leftHeaderRef} className="flex items-center justify-between mb-3">
                        <h2 className="text-3xl font-semibold text-textmain">Your Budgets</h2>
                        <span className="h-8 min-w-8 px-2 rounded-full bg-tableBG text-primary text-md flex items-center justify-center">
                            {statuses.length}
                        </span>
                    </div>

                    <div
                        className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1"
                        style={
                            leftListMaxHeight > 0
                                ? {
                                    maxHeight: `${Math.max(
                                        leftListMaxHeight - leftHeaderHeight,
                                        180,
                                    )}px`,
                                }
                                : undefined
                        }
                    >
                        {showInitialSkeletons &&
                            Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonBlock
                                    key={index}
                                    className="h-[220px] rounded-2xl"
                                />
                            ))}

                        {!showInitialSkeletons && statuses.length === 0 && (
                            <p className="rounded-2xl border border-primary bg-secondaryBG p-5 text-center text-textsecondary">
                                No budget statuses found.
                            </p>
                        )}

                        {!showInitialSkeletons &&
                            statuses.map((status) => {
                                const progress = clamp(Number(status.progress_percent || 0), 0, 100);
                                const isActive = status.budget_id === selectedBudgetId;

                                return (
                                    <div
                                        key={status.budget_id}
                                        onClick={() => setSelectedBudgetId(status.budget_id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                setSelectedBudgetId(status.budget_id);
                                            }
                                        }}
                                        className={`w-full rounded-2xl p-4 text-left transition duration-75 cursor-pointer bg-secondaryBG ${isActive
                                            ? "border-primary border "
                                            : "  hover:border-accent hover:border"
                                            }`}
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <h3 className="text-2xl font-semibold text-textmain">
                                                {status.category}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setDeleteDialog({ open: true, budgetId: status.budget_id, category: status.category });
                                                }}
                                                disabled={isDeletingBudget}
                                                className="rounded-lg border border-red-500 px-3 py-1 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Current Spend</p>
                                                <p className="font-semibold">{currency(status.current_spend)}</p>
                                            </div>
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Budget</p>
                                                <p className="font-semibold">{currency(status.budget_amount)}</p>
                                            </div>
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Remaining</p>
                                                <p className="font-semibold">{currency(status.remaining_budget)}</p>
                                            </div>
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Projected Spend</p>
                                                <p className="font-semibold">{currency(status.projected_period_spend)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-textsecondary">Progress {percent(progress)}</p>
                                            <div className="h-3 rounded-full bg-tableBG mt-1 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-primary"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Burn Rate / Day</p>
                                                <p className="font-semibold">{currency(status.burn_rate_per_day)}</p>
                                            </div>
                                            <div className="rounded-xl bg-tableBG p-2">
                                                <p className="text-xs uppercase text-textsecondary">Days Left</p>
                                                <p className="font-semibold">{status.days_left}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {(status.alerts || []).length > 0 ? (
                                                status.alerts.map((alert, idx) => (
                                                    <span
                                                        key={`${status.budget_id}-${idx}`}
                                                        className="rounded-full border border-primary bg-primary/10 px-2 py-1 text-xs text-primary"
                                                    >
                                                        {alert.title}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="rounded-full border border-primary bg-primary/10 px-2 py-1 text-xs text-primary">
                                                    No alerts
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </aside>

                <main ref={rightPanelRef} className="lg:col-span-8 self-start space-y-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-accent rounded-xl text-white">
                            <BsFileText size={22} />
                        </div>
                        <h2 className="text-3xl font-semibold text-textmain">Budget Details</h2>
                    </div>

                    {showInitialSkeletons ? (
                        <>
                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3 mt-4">
                                <SkeletonBlock className="h-7 w-52 rounded-lg" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <SkeletonBlock className="h-32 rounded-xl" />
                                    <SkeletonBlock className="h-32 rounded-xl" />
                                </div>
                            </section>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                    <SkeletonBlock className="h-7 w-48 rounded-lg" />
                                    <SkeletonBlock className="h-5 w-full rounded-lg" />
                                    <SkeletonBlock className="h-3 w-full rounded-full" />
                                    <SkeletonBlock className="h-5 w-full rounded-lg" />
                                    <SkeletonBlock className="h-3 w-full rounded-full" />
                                </section>

                                <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                    <SkeletonBlock className="h-7 w-40 rounded-lg" />
                                    <SkeletonBlock className="h-5 w-full rounded-lg" />
                                    <SkeletonBlock className="h-5 w-full rounded-lg" />
                                    <SkeletonBlock className="h-10 w-full rounded-lg" />
                                </section>
                            </div>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <SkeletonBlock className="h-7 w-44 rounded-lg" />
                                <SkeletonBlock className="h-12 w-full rounded-full" />
                                <SkeletonBlock className="h-24 w-full rounded-xl" />
                            </section>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <SkeletonBlock className="h-7 w-36 rounded-lg" />
                                <SkeletonBlock className="h-[280px] w-full rounded-xl bg-tableBG" />
                            </section>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <SkeletonBlock className="h-7 w-36 rounded-lg" />
                                <SkeletonBlock className="h-40 w-full rounded-xl" />
                            </section>
                        </>
                    ) : (
                        <>
                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3 mt-4">
                                <h3 className="text-2xl font-semibold text-textmain">Smart Suggestions</h3>
                                {suggestions?.suggestions?.length ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {suggestions.suggestions.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl  bg-tableBG p-3"
                                            >
                                                <p className="font-semibold text-lg mb-2 text-textmain">
                                                    {item.title} <span className="text-accent">({item.priority})</span>
                                                </p>
                                                <p className="text-textsecondary">{item.message}</p>
                                                <p className="text-accent text-lg mt-2">
                                                    Estimated savings: {currency(item.estimated_savings)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-textsecondary">No suggestions right now.</p>
                                )}
                            </section>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                    <h3 className="text-2xl font-semibold text-textmain">Pace & Prediction</h3>
                                    {selectedStatus ? (
                                        <>
                                            <div className="space-y-1">
                                                <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                    <span className="text-textmain">Predicted To Exceed</span>
                                                    <span className="font-semibold">
                                                        {selectedStatus.predicted_to_exceed ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                    <span className="text-textmain">Days Left</span>
                                                    <span className="font-semibold">{selectedStatus.days_left}</span>
                                                </div>
                                                <div className="flex justify-between pt-2">
                                                    <span className="text-textmain">Current Spend</span>
                                                    <span className="font-semibold">
                                                        {currency(currentSpend)} / {currency(budgetAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-3 rounded-full bg-tableBG overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-primary"
                                                    style={{ width: `${currentPct}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between pt-2">
                                                <span className="text-textmain">AI Projected Spend</span>
                                                <span className="font-semibold">
                                                    {currency(projectedSpend)} / {currency(budgetAmount)}
                                                </span>
                                            </div>

                                            <div className="h-3 rounded-full bg-tableBG overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-accent"
                                                    style={{ width: `${projectedPct}%` }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-textsecondary">Select a budget to see pace and prediction.</p>
                                    )}
                                </section>

                                <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                    <h3 className="text-2xl font-semibold text-textmain">Adaptive Goal</h3>
                                    {adaptive ? (
                                        <div className="space-y-1">
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Recommended Budget</span>
                                                <span className="font-semibold">
                                                    {currency(adaptive.recommended_budget_amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Adjustment %</span>
                                                <span className="font-semibold">
                                                    {percent(adaptive.adjustment_percent)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-3 py-1">
                                                <span className="text-textmain">Reason</span>
                                                <span className="font-semibold text-right">{adaptive.reason}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-textsecondary">Select a budget to see adaptive target.</p>
                                    )}
                                </section>
                            </div>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <h3 className="text-2xl font-semibold text-textmain">What-if Simulator</h3>

                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                    <div>
                                        <p className="text-textsecondary text-sm mb-1">Reduction %</p>
                                        <input
                                            type="number"
                                            value={reductionPercent}
                                            onChange={(e) => setReductionPercent(Number(e.target.value))}
                                            className="w-full rounded-full bg-accentBG px-3 py-2 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-textsecondary text-sm mb-1">Absolute Cut (Rs)</p>
                                        <input
                                            type="number"
                                            value={absoluteCut}
                                            onChange={(e) => setAbsoluteCut(Number(e.target.value))}
                                            className="w-full rounded-full  bg-accentBG px-3 py-2 outline-none"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!selectedStatus || isSimulationRunning}
                                        onClick={onRunSimulation}
                                        className="rounded-full bg-primary px-6 py-2 font-semibold disabled:opacity-50"
                                    >
                                        {isSimulationRunning ? "Running..." : "Run"}
                                    </button>
                                </div>

                                <div className="rounded-xl p-3">
                                    {lastSimulation ? (
                                        <div className="space-y-1">
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Baseline Projected</span>
                                                <span>{currency(lastSimulation.baseline_projected_spend)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Simulated Projected</span>
                                                <span>{currency(lastSimulation.simulated_projected_spend)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Projected Savings</span>
                                                <span>{currency(lastSimulation.projected_savings)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Baseline Exceed Risk</span>
                                                <span>
                                                    {lastSimulation.baseline_predicted_to_exceed ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                                <span className="text-textmain">Simulated Exceed Risk</span>
                                                <span>
                                                    {lastSimulation.simulated_predicted_to_exceed ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-textmain">Simulated Remaining</span>
                                                <span>{currency(lastSimulation.simulated_remaining_budget)}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-textsecondary text-center">
                                            Run a simulation to compare outcomes.
                                        </p>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <h3 className="text-2xl font-semibold text-textmain">Spending Chart</h3>
                                <div className="rounded-2xl p-3">
                                    <BarChart
                                        data={weeklySpendingData}
                                        indexBy="week"
                                        valueKey="amount"
                                    />
                                </div>
                            </section>

                            <section className="rounded-2xl bg-secondaryBG p-4 space-y-3">
                                <h3 className="text-2xl font-semibold text-textmain">Period Review</h3>
                                {review ? (
                                    <div className="space-y-1">
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Period</span>
                                            <span className="font-semibold">
                                                {`${formatReadableDate(review.period_start)} -> ${formatReadableDate(review.period_end)}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Closed</span>
                                            <span className="font-semibold">
                                                {review.is_period_closed ? "Yes" : "No"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Achieved</span>
                                            <span className="font-semibold">{review.achieved ? "Yes" : "No"}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Budget</span>
                                            <span className="font-semibold">{currency(review.budget_amount)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Total Spent</span>
                                            <span className="font-semibold">{currency(review.total_spent)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Savings / Overrun</span>
                                            <span className="font-semibold">
                                                {currency(review.savings_or_overrun)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-textsecondary py-2">
                                            <span className="text-textmain">Next Recommended</span>
                                            <span className="font-semibold">
                                                {currency(review.next_recommended_budget)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 py-1">
                                            <span className="text-textmain">Summary</span>
                                            <span className="font-semibold text-right">{review.summary}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-textsecondary">Select a budget to see period review.</p>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>

            <LoadingOverlay show={showLoadingOverlay} />
            {isCreateBudgetOpen && <CreateBudgetOverlay />}
            <SimpleConfirmationOverlay
                title="Delete Budget Goal"
                message={deleteDialog.category ? `Are you sure you want to delete the budget goal for \"${deleteDialog.category}\"? This action cannot be undone.` : undefined}
                isOpen={deleteDialog.open}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    if (deleteDialog.budgetId) {
                        deleteBudget(deleteDialog.budgetId, {
                            onSuccess: () => {
                                setSelectedBudgetId((currentId) =>
                                    currentId === deleteDialog.budgetId ? null : currentId
                                );
                                setDeleteDialog({ open: false, budgetId: null, category: null });
                                messageApi.success("Budget goal deleted successfully!");
                            },
                            onError: () => {
                                setDeleteDialog({ open: false, budgetId: null, category: null });
                                messageApi.error("Failed to delete budget goal. Try again.");
                            }
                        });
                    }
                }}
                onCancel={() => setDeleteDialog({ open: false, budgetId: null, category: null })}
            />
        </div>
    );
}
