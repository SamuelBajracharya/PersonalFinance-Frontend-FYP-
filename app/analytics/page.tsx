"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

const formatRupees = (value: number, fractionDigits = 2) =>
    `Rs. ${Number(value || 0).toFixed(fractionDigits)}`;

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

const limitBarPoints = (data: AnalyticsBarPoint[], pointLimit: number): AnalyticsBarPoint[] =>
    data.length > pointLimit ? data.slice(data.length - pointLimit) : data;

const getLatestThreeMonthLabels = (data: AnalyticsBarPoint[]) => {
    const monthTokens: string[] = [];

    data.forEach((point) => {
        const label = String(point.label || "");
        const match = label.match(/[A-Za-z]{3}/);
        if (match) {
            monthTokens.push(match[0]);
        }
    });

    const uniqueInOrder = monthTokens.filter(
        (value, index) => monthTokens.indexOf(value) === index
    );
    const latestThree = uniqueInOrder.slice(-3);

    if (latestThree.length === 3) {
        return latestThree;
    }

    return ["M1", "M2", "M3"];
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

const hasLinePoints = (series: AnalyticsLineSeries[]) =>
    series.some((serie) => serie.data.length > 0);

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

const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => reject(new Error("Failed to load exported image."));
        img.src = dataUrl;
    });
};

const actionButtonBaseClass =
    "h-9 rounded-lg px-3 text-xs font-semibold tracking-wide transition cursor-pointer";
const csvButtonClass =
    `${actionButtonBaseClass} bg-primary text-white hover:opacity-90`;
const pdfButtonClass =
    `${actionButtonBaseClass} bg-accent text-white hover:opacity-90`;
const refreshButtonClass =
    `${actionButtonBaseClass} border border-primary text-primary hover:bg-primary/10`;
const resetButtonClass =
    `${actionButtonBaseClass} border border-red-500 text-red-500 hover:bg-red-500/10`;
const toastStyle = { marginTop: 72 };

type PdfDoc = {
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    setFillColor: (r: number, g: number, b: number) => void;
    setTextColor: (r: number, g: number, b: number) => void;
    rect: (x: number, y: number, w: number, h: number, style: "F" | "S" | "FD") => void;
    setFontSize: (size: number) => void;
    text: (text: string, x: number, y: number) => void;
    addImage: (
        imageData: string,
        format: string,
        x: number,
        y: number,
        width: number,
        height: number
    ) => void;
    addPage: () => void;
    save: (fileName: string) => void;
    setDrawColor: (r: number, g: number, b: number) => void;
    setLineWidth: (width: number) => void;
};

export default function AnalyticsPage() {
    const router = useRouter();
    const chartsExportRef = useRef<HTMLDivElement | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedPreset, setSelectedPreset] = useState<PresetKey>("1y");
    const [selectedYear, setSelectedYear] = useState<YearFilter>("all");

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

        const fallbackLineSeries = () => {
            if (hasLinePoints(yearlyLineSeries)) return yearlyLineSeries;
            if (hasLinePoints(monthlyLineSeries)) return monthlyLineSeries;
            return weeklyLineSeries;
        };

        const fallbackLimitedSeries = (limit: number) =>
            limitSeriesPoints(fallbackLineSeries(), limit);

        if (selectedPreset === "7d") {
            if (selectedYear === "all") {
                const weeklyTx = limitBarPoints(weeklyTransactionData, 7);
                const weeklyBalance = limitBarPoints(weeklyBalanceData, 7);
                const weeklyLine = limitSeriesPoints(weeklyLineSeries, 7);

                return {
                    transactionBars: weeklyTx,
                    balanceBars: weeklyBalance,
                    lineSeries: hasLinePoints(weeklyLine)
                        ? weeklyLine
                        : fallbackLimitedSeries(7),
                };
            }

            return {
                transactionBars: weeklyTransactionData,
                balanceBars: weeklyBalanceData,
                lineSeries: hasLinePoints(weeklyLineSeries)
                    ? weeklyLineSeries
                    : fallbackLineSeries(),
            };
        }

        if (selectedPreset === "1m") {
            if (selectedYear === "all") {
                const monthlyTx = limitBarPoints(monthlyTransactionData, 30);
                const monthlyBalance = limitBarPoints(monthlyBalanceData, 30);
                const monthlyLine = limitSeriesPoints(monthlyLineSeries, 30);

                return {
                    transactionBars: monthlyTx,
                    balanceBars: monthlyBalance,
                    lineSeries: hasLinePoints(monthlyLine)
                        ? monthlyLine
                        : fallbackLimitedSeries(30),
                };
            }

            return {
                transactionBars: monthlyTransactionData,
                balanceBars: monthlyBalanceData,
                lineSeries: hasLinePoints(monthlyLineSeries)
                    ? monthlyLineSeries
                    : fallbackLineSeries(),
            };
        }

        if (selectedPreset === "3m") {
            if (selectedYear === "all") {
                const latestTxWindow = limitBarPoints(monthlyTransactionData, 90);
                const latestBalanceWindow = limitBarPoints(monthlyBalanceData, 90);
                const labels = getLatestThreeMonthLabels(latestTxWindow);
                const monthlyLimited = limitSeriesPoints(monthlyLineSeries, 90);

                return {
                    transactionBars: aggregateToThreeColumns(latestTxWindow, labels),
                    balanceBars: aggregateToThreeColumns(latestBalanceWindow, labels),
                    lineSeries: hasLinePoints(monthlyLimited)
                        ? monthlyLimited
                        : fallbackLimitedSeries(90),
                };
            }

            const monthlyLimited = limitSeriesPoints(monthlyLineSeries, 90);
            return {
                transactionBars: aggregateToThreeColumns(monthlyTransactionData, monthLabels),
                balanceBars: aggregateToThreeColumns(monthlyBalanceData, monthLabels),
                lineSeries: hasLinePoints(monthlyLimited)
                    ? monthlyLimited
                    : fallbackLineSeries(),
            };
        }

        if (selectedPreset === "1y") {
            if (selectedYear === "all") {
                const monthlyTx = limitBarPoints(monthlyTransactionData, 12);
                const monthlyBalance = limitBarPoints(monthlyBalanceData, 12);
                const monthlyLine = limitSeriesPoints(monthlyLineSeries, 12);

                return {
                    transactionBars: monthlyTx.length ? monthlyTx : yearlyTransactionData,
                    balanceBars: monthlyBalance.length ? monthlyBalance : yearlyBalanceData,
                    lineSeries: hasLinePoints(monthlyLine)
                        ? monthlyLine
                        : hasLinePoints(yearlyLineSeries)
                            ? yearlyLineSeries
                            : fallbackLimitedSeries(12),
                };
            }

            const monthlyTx = limitBarPoints(monthlyTransactionData, 12);
            const monthlyBalance = limitBarPoints(monthlyBalanceData, 12);
            const monthlyLine = limitSeriesPoints(monthlyLineSeries, 12);

            return {
                transactionBars: monthlyTx.length ? monthlyTx : yearlyTransactionData,
                balanceBars: monthlyBalance.length ? monthlyBalance : yearlyBalanceData,
                lineSeries: hasLinePoints(monthlyLine)
                    ? monthlyLine
                    : hasLinePoints(yearlyLineSeries)
                        ? yearlyLineSeries
                        : fallbackLineSeries(),
            };
        }

        return {
            transactionBars: yearlyTransactionData,
            balanceBars: yearlyBalanceData,
            lineSeries: hasLinePoints(yearlyLineSeries)
                ? yearlyLineSeries
                : fallbackLineSeries(),
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
            void messageApi.warning({ content: "No analytics data available to export.", style: toastStyle });
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
        void messageApi.success({ content: "CSV export started.", style: toastStyle });
    };

    const handleDownloadPdf = async () => {
        const exportElement = chartsExportRef.current;

        if (!exportElement) {
            void messageApi.warning({ content: "Charts are not ready to export yet.", style: toastStyle });
            return;
        }

        if (!hasAnyData) {
            void messageApi.warning({ content: "No analytics charts available to export.", style: toastStyle });
            return;
        }

        const loadingKey = "analytics-pdf-export";

        try {
            messageApi.open({
                type: "loading",
                content: "Generating chart PDF...",
                key: loadingKey,
                duration: 0,
                style: toastStyle,
            });

            const [htmlToImageModule, jsPdfModule] = await Promise.all([
                import("html-to-image"),
                import("jspdf"),
            ]);

            const toPng = htmlToImageModule.toPng;

            if (!toPng) {
                throw new Error("Image capture library failed to initialize.");
            }

            const JsPDF =
                (jsPdfModule as { jsPDF?: new (...args: unknown[]) => unknown }).jsPDF ??
                (jsPdfModule as { default?: new (...args: unknown[]) => unknown }).default;

            if (!JsPDF) {
                throw new Error("PDF library failed to initialize.");
            }

            await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

            const pdf = new JsPDF("p", "mm", "a4") as PdfDoc;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 10;

            const drawCard = (x: number, y: number, w: number, h: number) => {
                pdf.setDrawColor(220, 220, 220);
                pdf.setLineWidth(0.2);
                pdf.setFillColor(255, 255, 255);
                pdf.rect(x, y, w, h, "FD");
            };

            const captureChart = async (key: string) => {
                const node = exportElement.querySelector(
                    `[data-export-chart="${key}"]`
                ) as HTMLElement | null;
                if (!node) return null;

                const dataUrl = await toPng(node, {
                    backgroundColor: "#ffffff",
                    pixelRatio: 2,
                    cacheBust: true,
                    width: node.scrollWidth,
                    height: node.scrollHeight,
                });

                const dim = await getImageDimensions(dataUrl);
                if (!dim.width || !dim.height) return null;

                return { dataUrl, width: dim.width, height: dim.height };
            };

            const rangeText = currentRange
                ? `${dayjs(currentRange.startDate).format("YYYY-MM-DD")} to ${dayjs(currentRange.endDate).format("YYYY-MM-DD")}`
                : "All available dates";
            const filterText = `Preset ${presetLabels[selectedPreset]}  |  Year ${selectedYear === "all" ? "All" : selectedYear}  |  ${rangeText}`;

            pdf.setTextColor(15, 15, 15);
            pdf.setFontSize(20);
            pdf.text("Analytics Report", margin, 14);
            pdf.setFontSize(10);
            pdf.text(filterText, margin, 20);
            pdf.text(`Generated ${dayjs().format("YYYY-MM-DD HH:mm")}`, margin, 25);

            const fullWidth = pageWidth - margin * 2;
            const gap = 4;
            const cardW = (fullWidth - gap * 2) / 3;
            const topY = 30;
            const statH = 18;

            const drawStat = (x: number, label: string, value: string) => {
                drawCard(x, topY, cardW, statH);
                pdf.setFontSize(8);
                pdf.setTextColor(90, 90, 90);
                pdf.text(label, x + 3, topY + 6);
                pdf.setFontSize(11);
                pdf.setTextColor(10, 10, 10);
                pdf.text(value, x + 3, topY + 13);
            };

            drawStat(margin, "Income", formatRupees(currentIncomeTotal));
            drawStat(margin + cardW + gap, "Expense", formatRupees(currentExpenseTotal));
            drawStat(margin + (cardW + gap) * 2, "Net", formatRupees(currentNet));

            const txChart = await captureChart("transactions");
            const balanceChart = await captureChart("balance");
            const cashflowChart = await captureChart("cashflow");
            const expenseChart = await captureChart("expense");
            const incomeChart = await captureChart("income");

            const twoColW = (fullWidth - gap) / 2;
            const row2Y = topY + statH + gap;
            const row2H = 46;
            const row3Y = row2Y + row2H + gap;
            const row3H = 50;
            const row4Y = row3Y + row3H + gap;
            const row4H = 52;

            const placeChartCard = (
                x: number,
                y: number,
                w: number,
                h: number,
                title: string,
                chart: { dataUrl: string; width: number; height: number } | null
            ) => {
                drawCard(x, y, w, h);
                pdf.setFontSize(9);
                pdf.setTextColor(30, 30, 30);
                pdf.text(title, x + 3, y + 5);

                if (!chart) {
                    pdf.setTextColor(140, 140, 140);
                    pdf.text("No chart data", x + 3, y + 12);
                    return;
                }

                const imagePad = 2;
                const imageX = x + imagePad;
                const imageY = y + 7;
                const maxW = w - imagePad * 2;
                const maxH = h - 9;
                const scale = Math.min(maxW / chart.width, maxH / chart.height);
                const renderW = chart.width * scale;
                const renderH = chart.height * scale;
                const offsetX = imageX + (maxW - renderW) / 2;
                const offsetY = imageY + (maxH - renderH) / 2;

                pdf.addImage(chart.dataUrl, "PNG", offsetX, offsetY, renderW, renderH);
            };

            const placePieCard = (
                x: number,
                y: number,
                w: number,
                h: number,
                title: string,
                chart: { dataUrl: string; width: number; height: number } | null,
                items: AnalyticsPiePoint[],
                colors: string[]
            ) => {
                drawCard(x, y, w, h);
                pdf.setFontSize(9);
                pdf.setTextColor(30, 30, 30);
                pdf.text(title, x + 3, y + 5);

                const contentY = y + 7;
                const contentH = h - 9;
                const chartW = w * 0.56;
                const legendX = x + chartW + 2;
                const legendW = w - chartW - 4;

                if (chart) {
                    const maxW = chartW - 4;
                    const maxH = contentH;
                    const scale = Math.min(maxW / chart.width, maxH / chart.height);
                    const renderW = chart.width * scale;
                    const renderH = chart.height * scale;
                    const imgX = x + 2 + (maxW - renderW) / 2;
                    const imgY = contentY + (maxH - renderH) / 2;
                    pdf.addImage(chart.dataUrl, "PNG", imgX, imgY, renderW, renderH);
                }

                const legendItems = items.slice(0, 4);
                const lineHeight = 6;
                let legendY = contentY + 5;

                legendItems.forEach((item, index) => {
                    const color = colors[index % colors.length] ?? "#999999";
                    const r = Number.parseInt(color.slice(1, 3), 16) || 120;
                    const g = Number.parseInt(color.slice(3, 5), 16) || 120;
                    const b = Number.parseInt(color.slice(5, 7), 16) || 120;

                    pdf.setFillColor(r, g, b);
                    pdf.rect(legendX, legendY - 2.8, 2.4, 2.4, "F");

                    pdf.setFontSize(7.5);
                    pdf.setTextColor(50, 50, 50);

                    const label = item.label || String(item.id);
                    const valueText = formatRupees(Number(item.value || 0), 0);
                    const clippedLabel = label.length > 18 ? `${label.slice(0, 18)}...` : label;

                    pdf.text(clippedLabel, legendX + 3.2, legendY - 1);
                    pdf.text(valueText, legendX + Math.max(legendW - 11, 10), legendY - 1);

                    legendY += lineHeight;
                });
            };

            placeChartCard(margin, row2Y, twoColW, row2H, "Total Transaction Summary", txChart);
            placeChartCard(margin + twoColW + gap, row2Y, twoColW, row2H, "Total Balance Summary", balanceChart);
            placeChartCard(margin, row3Y, fullWidth, row3H, "Cashflow Statistics", cashflowChart);
            placePieCard(margin, row4Y, twoColW, row4H, "Expense Category Chart", expenseChart, pieExpense, expenseColors);
            placePieCard(
                margin + twoColW + gap,
                row4Y,
                twoColW,
                row4H,
                "Income Category Chart",
                incomeChart,
                pieIncome,
                incomeColors
            );

            const fileSuffix = selectedYear === "all" ? "all-years" : String(selectedYear);
            const fileName = `analytics-${fileSuffix}-${selectedPreset}-${dayjs().format("YYYYMMDD-HHmm")}.pdf`;
            pdf.save(fileName);

            void messageApi.success({ content: "PDF export completed.", key: loadingKey, style: toastStyle });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to generate chart PDF.";
            void messageApi.error({ content: errorMessage, key: loadingKey, style: toastStyle });
        }
    };

    const handleResetFilters = () => {
        setSelectedPreset("1y");
        setSelectedYear("all");
    };

    const showLoadingOverlay = analyticsQuery.isFetching;
    const showInitialSkeletons = analyticsQuery.isLoading && !analyticsQuery.data;
    const hasAnyData = hasAnyPoints(api);

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
            {contextHolder}
            <div className="rounded-2xl bg-secondaryBG border border-white/10 p-4 md:p-5">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
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

                        <Select
                            value={selectedYear}
                            onChange={(value) => setSelectedYear(value as YearFilter)}
                            options={yearOptions}
                            className="custom-select min-w-[120px]"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={handleDownloadCsv} className={csvButtonClass}>
                            Download CSV
                        </button>
                        <button onClick={() => void handleDownloadPdf()} className={pdfButtonClass}>
                            Download PDF
                        </button>
                        <button onClick={() => void analyticsQuery.refetch()} className={refreshButtonClass}>
                            Refresh
                        </button>
                        <button onClick={handleResetFilters} className={resetButtonClass}>
                            Reset
                        </button>
                    </div>
                </div>
                <p className="text-xs text-textsecondary mt-3">
                    Viewing {presetLabels[selectedPreset]} window for {selectedYear === "all" ? "all years" : selectedYear}.
                </p>
            </div>

            <div ref={chartsExportRef} className="space-y-6">
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
                    <div data-export-block="transactions" className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                                    <FaExchangeAlt size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-medium">Total Transaction Summary</h3>
                            </div>
                        </div>

                        <div data-export-chart="transactions">
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
                    </div>

                    <div data-export-block="balance" className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                                    <FaBalanceScale size={32} className="text-white" />
                                </div>
                                <h3 className="text-lg font-medium">Total Balance Summary</h3>
                            </div>
                        </div>

                        <div data-export-chart="balance">
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
                </div>

                <div data-export-block="cashflow" className="bg-secondaryBG rounded-2xl p-5 md:p-8 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
                                <AiOutlineTransaction size={40} className="text-white" />
                            </div>
                            <h3 className="text-lg font-medium">Cashflow Statistics</h3>
                        </div>
                    </div>

                    <div data-export-chart="cashflow">
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
                    </div>

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
                    <div data-export-block="expense" className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col lg:flex-row gap-6">
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
                            <div data-export-chart="expense">
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
                                        <div className="text-sm">{formatRupees(Number(p.value || 0), 0)}</div>
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div data-export-block="income" className="bg-secondaryBG rounded-2xl p-5 md:p-6 border border-white/10 flex flex-col lg:flex-row gap-6">
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
                            <div data-export-chart="income">
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
                                        <div className="text-sm">{formatRupees(Number(p.value || 0), 0)}</div>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

            </div>

            <LoadingOverlay show={showLoadingOverlay} />
            {isOpen && <LinkAccountOverlay />}
        </div>
    );
}
