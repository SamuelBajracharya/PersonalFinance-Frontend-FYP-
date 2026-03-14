"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Select, message } from "antd";
import { FaExchangeAlt, FaBalanceScale } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import BarChart from "@/components/gloabalComponents/BarChart";
import LineChart from "@/components/gloabalComponents/LineChart";
import PieChart from "@/components/gloabalComponents/PieChart";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import LinkAccountOverlay from "@/components/gloabalComponents/LinkAccountOverlay";
import { useFetchAnalytics } from "@/hooks/useAnalytics";
import { useBankOverlay } from "@/stores/useBankOverlay";
import { useNabilAccountStore } from "@/stores/useNabilAccountStore";
import {
    AnalyticsPiePoint,
    AnalyticsBarPoint,
    AnalyticsLineSeries,
    AnalyticsResponse,
} from "@/types/analytics";

const expenseColors = ["#8E0D28", "#B12434", "#D54654", "#F08B84", "#F4C9B9"];
const incomeColors = ["#125C3E", "#1E7B53", "#47A56C", "#7DCF9A", "#C7F5D6"];

type PresetKey = "7d" | "1m" | "3m" | "1y";
type YearFilter = number | "all";
type ExportRow = {
    section: string;
    metric: string;
    label: string;
    value: number;
};

const emptyAnalytics: AnalyticsResponse = {
    yearlyTransactionData: [],
    monthlyTransactionData: [],
    weeklyTransactionData: [],
    yearlyBalanceData: [],
    monthlyBalanceData: [],
    weeklyBalanceData: [],
    yearlyLineSeries: [],
    monthlyLineSeries: [],
    weeklyLineSeries: [],
    pieExpense: [],
    pieIncome: [],
};

const presetLabels: Record<PresetKey, string> = {
    "7d": "7D",
    "1m": "1M",
    "3m": "3M",
    "1y": "1Y",
};

const getPresetRangeForYear = (
    preset: PresetKey,
    year: number
): [dayjs.Dayjs, dayjs.Dayjs] => {
    const yearStart = dayjs().year(year).startOf("year");
    const yearEnd = dayjs().year(year).endOf("year");
    const todayEnd = dayjs().endOf("day");
    const effectiveEnd = yearEnd.isAfter(todayEnd) ? todayEnd : yearEnd;

    const clampToYearStart = (value: dayjs.Dayjs) =>
        value.isBefore(yearStart) ? yearStart : value;

    switch (preset) {
        case "7d":
            return [
                clampToYearStart(effectiveEnd.subtract(6, "day").startOf("day")),
                effectiveEnd,
            ];
        case "1m":
            return [
                clampToYearStart(effectiveEnd.subtract(1, "month").add(1, "day").startOf("day")),
                effectiveEnd,
            ];
        case "3m":
            return [
                clampToYearStart(effectiveEnd.subtract(3, "month").add(1, "day").startOf("day")),
                effectiveEnd,
            ];
        case "1y":
            return [yearStart, effectiveEnd];
        default:
            return [
                clampToYearStart(effectiveEnd.subtract(1, "month").add(1, "day").startOf("day")),
                effectiveEnd,
            ];
    }
};

const sumPieValues = (data: AnalyticsPiePoint[]) =>
    data.reduce((total, item) => total + Number(item.value || 0), 0);

const hasAnyPoints = (analytics: AnalyticsResponse): boolean => {
    return (
        analytics.yearlyTransactionData.length > 0 ||
        analytics.monthlyTransactionData.length > 0 ||
        analytics.weeklyTransactionData.length > 0 ||
        analytics.yearlyBalanceData.length > 0 ||
        analytics.monthlyBalanceData.length > 0 ||
        analytics.weeklyBalanceData.length > 0 ||
        analytics.yearlyLineSeries.some((serie) => serie.data.length > 0) ||
        analytics.monthlyLineSeries.some((serie) => serie.data.length > 0) ||
        analytics.weeklyLineSeries.some((serie) => serie.data.length > 0) ||
        analytics.pieExpense.length > 0 ||
        analytics.pieIncome.length > 0
    );
};

const getMonthLabelsForRange = (year: number): string[] => {
    const end = dayjs().year(year).endOf("year");
    const effectiveEnd = end.isAfter(dayjs()) ? dayjs() : end;

    return [2, 1, 0].map((offset) =>
        effectiveEnd.subtract(offset, "month").format("MMM")
    );
};

const aggregateToThreeColumns = (
    data: AnalyticsBarPoint[],
    labels: string[]
): AnalyticsBarPoint[] => {
    if (data.length === 0) {
        return labels.map((label) => ({ label, value: 0 }));
    }

    const totals = [0, 0, 0];

    data.forEach((point, index) => {
        const bucket = Math.min(2, Math.floor((index * 3) / data.length));
        totals[bucket] += Number(point.value || 0);
    });

    return labels.map((label, index) => ({
        label,
        value: Number(totals[index].toFixed(2)),
    }));
};

const limitSeriesPoints = (
    series: AnalyticsLineSeries[],
    pointLimit: number
): AnalyticsLineSeries[] =>
    series.map((serie) => ({
        ...serie,
        data:
            serie.data.length > pointLimit
                ? serie.data.slice(serie.data.length - pointLimit)
                : serie.data,
    }));

const escapeCsvValue = (value: string | number) => {
    const asText = String(value).replace(/"/g, '""');
    return `"${asText}"`;
};

const downloadTextFile = (fileName: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
};

export default function AnalyticsPage() {
    const router = useRouter();
    const [selectedPreset, setSelectedPreset] = useState<PresetKey>("1m");
    const [selectedYear, setSelectedYear] = useState<YearFilter>(dayjs().year());

    const { isOpen, isBankLinked, isInitialized, open, initialize } = useBankOverlay();
    const nabilAccountId = useNabilAccountStore((state) => state.nabilAccountId);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const currentRange = useMemo(() => {
        if (selectedYear === "all") {
            return null;
        }

        const [start, end] = getPresetRangeForYear(selectedPreset, selectedYear);
        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        };
    }, [selectedPreset, selectedYear]);

    const yearOptions = useMemo(() => {
        const currentYear = dayjs().year();
        const yearlyOptions = Array.from({ length: 8 }, (_, index) => {
            const year = currentYear - index;
            return { value: year, label: String(year) };
        });

        return [{ value: "all" as const, label: "All" }, ...yearlyOptions];
    }, []);

    const analyticsQuery = useFetchAnalytics({
        accountId: nabilAccountId,
        startDate: currentRange?.startDate,
        endDate: currentRange?.endDate,
        enabled: isBankLinked,
    });

    const api = analyticsQuery.data || emptyAnalytics;

    const yearlyTransactionData = api.yearlyTransactionData;
    const monthlyTransactionData = api.monthlyTransactionData;
    const weeklyTransactionData = api.weeklyTransactionData;

    const yearlyBalanceData = api.yearlyBalanceData;
    const monthlyBalanceData = api.monthlyBalanceData;
    const weeklyBalanceData = api.weeklyBalanceData;

    const yearlyLineSeries = api.yearlyLineSeries;
    const monthlyLineSeries = api.monthlyLineSeries;
    const weeklyLineSeries = api.weeklyLineSeries;

    const pieExpense = api.pieExpense;
    const pieIncome = api.pieIncome;

    const chartData = useMemo(() => {
        const monthLabels = getMonthLabelsForRange(
            selectedYear === "all" ? dayjs().year() : selectedYear
        );

        if (selectedPreset === "7d") {
            return {
                transactionBars: weeklyTransactionData,
                balanceBars: weeklyBalanceData,
                lineSeries: weeklyLineSeries,
            };
        }

        if (selectedPreset === "1m") {
            return {
                transactionBars: monthlyTransactionData,
                balanceBars: monthlyBalanceData,
                lineSeries: monthlyLineSeries,
            };
        }

        if (selectedPreset === "3m") {
            return {
                transactionBars: aggregateToThreeColumns(monthlyTransactionData, monthLabels),
                balanceBars: aggregateToThreeColumns(monthlyBalanceData, monthLabels),
                lineSeries: limitSeriesPoints(monthlyLineSeries, 90),
            };
        }

        return {
            transactionBars: yearlyTransactionData,
            balanceBars: yearlyBalanceData,
            lineSeries: yearlyLineSeries,
        };
    }, [
        selectedPreset,
        selectedYear,
        weeklyTransactionData,
        weeklyBalanceData,
        weeklyLineSeries,
        monthlyTransactionData,
        monthlyBalanceData,
        monthlyLineSeries,
        yearlyTransactionData,
        yearlyBalanceData,
        yearlyLineSeries,
    ]);

    const currentExpenseTotal = sumPieValues(pieExpense);
    const currentIncomeTotal = sumPieValues(pieIncome);
    const currentNet = currentIncomeTotal - currentExpenseTotal;

    const exportRows = useMemo<ExportRow[]>(() => {
        const rows: ExportRow[] = [];

        chartData.transactionBars.forEach((point) => {
            rows.push({
                section: "bar",
                metric: "transactions",
                label: point.label,
                value: Number(point.value || 0),
            });
        });

        chartData.balanceBars.forEach((point) => {
            rows.push({
                section: "bar",
                metric: "balance",
                label: point.label,
                value: Number(point.value || 0),
            });
        });

        chartData.lineSeries.forEach((serie) => {
            serie.data.forEach((point) => {
                rows.push({
                    section: "line",
                    metric: String(serie.id),
                    label: String(point.x),
                    value: Number(point.y || 0),
                });
            });
        });

        pieExpense.forEach((point) => {
            rows.push({
                section: "pie",
                metric: "expense",
                label: point.label || String(point.id),
                value: Number(point.value || 0),
            });
        });

        pieIncome.forEach((point) => {
            rows.push({
                section: "pie",
                metric: "income",
                label: point.label || String(point.id),
                value: Number(point.value || 0),
            });
        });

        return rows;
    }, [chartData.transactionBars, chartData.balanceBars, chartData.lineSeries, pieExpense, pieIncome]);

    const handleDownloadCsv = () => {
        if (!exportRows.length) {
            void message.warning("No analytics data available to export.");
            return;
        }

        const headers = ["section", "metric", "label", "value"];
        const lines = [headers.join(",")];

        exportRows.forEach((row) => {
            lines.push(
                [
                    escapeCsvValue(row.section),
                    escapeCsvValue(row.metric),
                    escapeCsvValue(row.label),
                    escapeCsvValue(row.value),
                ].join(",")
            );
        });

        const fileSuffix = selectedYear === "all" ? "all-years" : String(selectedYear);
        const fileName = `analytics-${fileSuffix}-${selectedPreset}-${dayjs().format("YYYYMMDD-HHmm")}.csv`;

        downloadTextFile(fileName, lines.join("\n"), "text/csv;charset=utf-8");
        void message.success("CSV export started.");
    };

    const handleDownloadJson = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            preset: selectedPreset,
            year: selectedYear,
            dateRange: currentRange,
            totals: {
                income: currentIncomeTotal,
                expense: currentExpenseTotal,
                net: currentNet,
            },
            rows: exportRows,
        };

        const fileSuffix = selectedYear === "all" ? "all-years" : String(selectedYear);
        const fileName = `analytics-${fileSuffix}-${selectedPreset}-${dayjs().format("YYYYMMDD-HHmm")}.json`;

        downloadTextFile(fileName, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
        void message.success("JSON export started.");
    };

    const handleCopyShareLink = async () => {
        try {
            const params = new URLSearchParams();
            params.set("preset", selectedPreset);
            params.set("year", String(selectedYear));

            const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
            await navigator.clipboard.writeText(url);
            void message.success("Share link copied.");
        } catch {
            void message.error("Failed to copy share link.");
        }
    };

    const handleResetFilters = () => {
        setSelectedPreset("1m");
        setSelectedYear(dayjs().year());
    };

    const showLoadingOverlay = analyticsQuery.isFetching;
    const showInitialSkeletons = analyticsQuery.isLoading && !analyticsQuery.data;
    const hasAnyData = hasAnyPoints(api);

    const insightLines = useMemo(() => {
        const windowLabel =
            selectedYear === "all"
                ? `${presetLabels[selectedPreset]} window across all years`
                : `${presetLabels[selectedPreset]} of ${selectedYear}`;

        if (!hasAnyData) {
            return [
                `No analytics data found for ${windowLabel}.`,
                "Try another duration or switch to a different year.",
            ];
        }

        return [
            `Showing ${windowLabel}. Net cashflow is ${currentNet.toFixed(2)}.`,
            `Income is ${currentIncomeTotal.toFixed(2)} and expense is ${currentExpenseTotal.toFixed(2)}.`,
        ];
    }, [
        selectedPreset,
        selectedYear,
        currentExpenseTotal,
        currentIncomeTotal,
        currentNet,
        hasAnyData,
    ]);

    const navigateToTransactions = (params: {
        sourceType: "transaction" | "balance" | "cashflow" | "category";
        label: string;
        flowType?: "income" | "expense";
        value?: number;
    }) => {
        const query = new URLSearchParams();

        query.set("source", "analytics");
        query.set("type", params.sourceType);
        query.set("label", params.label);

        if (params.flowType) query.set("flow", params.flowType);
        if (typeof params.value === "number") query.set("value", String(params.value));

        if (currentRange) {
            query.set("startDate", currentRange.startDate);
            query.set("endDate", currentRange.endDate);
        }

        router.push(`/transactions?${query.toString()}`);
    };

    if (!isInitialized) {
        return (
            <div className="min-h-screen space-y-6 p-4 md:p-6">
                <SkeletonBlock className="h-14 w-full rounded-xl bg-highlight" />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <SkeletonBlock className="h-[360px] w-full rounded-2xl bg-highlight" />
                    <SkeletonBlock className="h-[360px] w-full rounded-2xl bg-highlight" />
                </div>
                <SkeletonBlock className="h-[400px] w-full rounded-2xl bg-highlight" />
            </div>
        );
    }

    if (!isBankLinked || !nabilAccountId) {
        return (
            <div className="min-h-screen p-4 md:p-6">
                <div className="rounded-2xl bg-secondaryBG p-6 md:p-8 border border-white/10">
                    <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-3">
                        Link Your Bank Account
                    </h2>
                    <p className="text-textsecondary text-base md:text-lg max-w-3xl mb-6">
                        Analytics needs your connected account to render spending patterns and cashflow trends.
                    </p>
                    <button
                        onClick={open}
                        className="border border-accent text-accent px-8 py-3 rounded-full text-base md:text-lg hover:bg-accent hover:text-white transition cursor-pointer"
                    >
                        Link Account
                    </button>
                </div>
                {isOpen && <LinkAccountOverlay />}
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 p-4 md:p-6">
            <div className="rounded-2xl bg-secondaryBG border border-white/10 p-4 md:p-5">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div className="inline-flex items-center gap-1 rounded-xl bg-[#1A1A1A] p-1 border border-white/10 w-fit">
                        {(Object.keys(presetLabels) as PresetKey[]).map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setSelectedPreset(preset)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition cursor-pointer ${selectedPreset === preset
                                    ? "bg-[#F5AD30] text-[#151515]"
                                    : "text-[#A8A8A8] hover:text-white"
                                    }`}
                            >
                                {presetLabels[preset]}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={selectedYear}
                            onChange={(value) => setSelectedYear(value as YearFilter)}
                            options={yearOptions}
                            className="custom-select min-w-[120px]"
                        />
                        <Button onClick={handleDownloadCsv}>Download CSV</Button>
                        <Button onClick={handleDownloadJson}>Download JSON</Button>
                        <Button onClick={handleCopyShareLink}>Copy Link</Button>
                        <Button onClick={() => void analyticsQuery.refetch()}>Refresh</Button>
                        <Button onClick={handleResetFilters}>Reset</Button>
                    </div>
                </div>
                <p className="text-xs text-textsecondary mt-3">
                    Viewing {presetLabels[selectedPreset]} window for {selectedYear === "all" ? "all years" : selectedYear}.
                </p>
            </div>



            {analyticsQuery.isError && (
                <div className="rounded-2xl bg-red-900/20 border border-red-400/30 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-red-300 text-sm md:text-base">
                        Failed to load analytics for the selected filter. Try again.
                    </p>
                    <Button
                        type="default"
                        onClick={() => {
                            void analyticsQuery.refetch();
                        }}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {!showInitialSkeletons && !analyticsQuery.isError && !hasAnyData && (
                <div className="rounded-2xl bg-secondaryBG border border-white/10 p-6 md:p-8 text-center">
                    <h3 className="text-xl font-semibold mb-2">No Data In This Range</h3>
                    <p className="text-textsecondary">
                        There were no transactions found for the selected period.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                                <FaExchangeAlt size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-medium">Total Transaction Summary</h3>
                        </div>
                    </div>

                    {showInitialSkeletons ? (
                        <SkeletonBlock className="h-[320px] w-full rounded-xl bg-highlight" />
                    ) : (
                        <BarChart
                            data={chartData.transactionBars}
                            indexBy="label"
                            valueKey="value"
                            onBarClick={({ indexValue, value }) =>
                                navigateToTransactions({
                                    sourceType: "transaction",
                                    label: String(indexValue),
                                    value,
                                })
                            }
                        />
                    )}
                </div>

                <div className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                                <FaBalanceScale size={32} className="text-white" />
                            </div>
                            <h3 className="text-lg font-medium">Total Balance Summary</h3>
                        </div>
                    </div>

                    {showInitialSkeletons ? (
                        <SkeletonBlock className="h-[320px] w-full rounded-xl bg-highlight" />
                    ) : (
                        <BarChart
                            data={chartData.balanceBars}
                            indexBy="label"
                            valueKey="value"
                            onBarClick={({ indexValue, value }) =>
                                navigateToTransactions({
                                    sourceType: "balance",
                                    label: String(indexValue),
                                    value,
                                })
                            }
                        />
                    )}
                </div>
            </div>

            <div className="bg-secondaryBG rounded-2xl p-5 md:p-8 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                            <AiOutlineTransaction size={40} className="text-white" />
                        </div>
                        <h3 className="text-lg font-medium">Cashflow Statistics</h3>
                    </div>
                </div>

                {showInitialSkeletons ? (
                    <SkeletonBlock className="h-[350px] w-full rounded-xl bg-highlight" />
                ) : (
                    <LineChart
                        series={chartData.lineSeries}
                        onPointClick={({ seriesId, x, y }) =>
                            navigateToTransactions({
                                sourceType: "cashflow",
                                label: `${seriesId}:${x}`,
                                flowType: seriesId.toLowerCase().includes("income") ? "income" : "expense",
                                value: y,
                            })
                        }
                    />
                )}

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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                <div className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-3/5">
                        <div className="flex items-center gap-3 mb-3">
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
                        {showInitialSkeletons ? (
                            <SkeletonBlock className="h-[300px] w-full rounded-xl bg-highlight" />
                        ) : (
                            <PieChart
                                data={pieExpense}
                                colors={expenseColors}
                                onSliceClick={({ id, label, value }) =>
                                    navigateToTransactions({
                                        sourceType: "category",
                                        label: label || id,
                                        flowType: "expense",
                                        value,
                                    })
                                }
                            />
                        )}
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col justify-center gap-3">
                        {!showInitialSkeletons &&
                            pieExpense.map((p, i) => (
                                <button
                                    key={p.id}
                                    onClick={() =>
                                        navigateToTransactions({
                                            sourceType: "category",
                                            label: p.label || p.id,
                                            flowType: "expense",
                                            value: p.value,
                                        })
                                    }
                                    className="flex items-center justify-between text-left hover:bg-white/5 rounded-lg p-2 transition cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-7 rounded-md"
                                            style={{ backgroundColor: expenseColors[i % expenseColors.length] }}
                                        />
                                        <div>
                                            <div className="text-sm">{p.label}</div>
                                            <div className="text-xs text-gray-400">{p.value}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm">${p.value}</div>
                                </button>
                            ))}
                    </div>
                </div>

                <div className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-3/5">
                        <div className="flex items-center gap-3 mb-3">
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
                        {showInitialSkeletons ? (
                            <SkeletonBlock className="h-[300px] w-full rounded-xl bg-highlight" />
                        ) : (
                            <PieChart
                                data={pieIncome}
                                colors={incomeColors}
                                onSliceClick={({ id, label, value }) =>
                                    navigateToTransactions({
                                        sourceType: "category",
                                        label: label || id,
                                        flowType: "income",
                                        value,
                                    })
                                }
                            />
                        )}
                    </div>

                    <div className="w-full lg:w-2/5 flex flex-col justify-center gap-3">
                        {!showInitialSkeletons &&
                            pieIncome.map((p, i) => (
                                <button
                                    key={p.id}
                                    onClick={() =>
                                        navigateToTransactions({
                                            sourceType: "category",
                                            label: p.label || p.id,
                                            flowType: "income",
                                            value: p.value,
                                        })
                                    }
                                    className="flex items-center justify-between text-left hover:bg-white/5 rounded-lg p-2 transition cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-7 rounded-md"
                                            style={{ backgroundColor: incomeColors[i % incomeColors.length] }}
                                        />
                                        <div>
                                            <div className="text-sm">{p.label}</div>
                                            <div className="text-xs text-gray-400">{p.value}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm">${p.value}</div>
                                </button>
                            ))}
                    </div>
                </div>
            </div>

            <LoadingOverlay show={showLoadingOverlay} />
            {isOpen && <LinkAccountOverlay />}
        </div>
    );
}
