"use client";

import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { HiChartBar, HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { FaCoins } from "react-icons/fa";
import StockInstrumentCard from "@/components/gloabalComponents/StockInstrumentCard";
import StockSummaryCard from "@/components/gloabalComponents/StockSummaryCard";
import StockPredictionChart from "@/components/gloabalComponents/StockPredictionChart";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import { useStockPredictions } from "@/hooks/useStockPrediction";

type RangeFilter = "1W" | "1M" | "3M" | "1Y";

const rangeOptions: RangeFilter[] = ["1W", "1M", "3M", "1Y"];

const rangeToHorizon: Record<RangeFilter, number> = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 365,
};

export default function MyStocksPage() {
    const [range, setRange] = useState<RangeFilter>("1M");
    const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

    const { data: predictions = [], isLoading, isFetching, isError, error } = useStockPredictions({
        horizon_days: rangeToHorizon[range],
        confidence_level: 0.95,
    });

    const instruments = useMemo(
        () =>
            predictions.map((item) => {
                const currentPrice = item.past_price_history.at(-1)?.price ?? 0;
                const holdingValue = currentPrice * item.quantity;

                return {
                    symbol: item.instrument,
                    company: item.name,
                    price: currentPrice,
                    changePercent: item.expected_return_pct,
                    holdingValue,
                    holdingAmount: item.quantity,
                };
            }),
        [predictions],
    );

    useEffect(() => {
        if (!instruments.length) {
            setSelectedInstrument(null);
            return;
        }

        if (!selectedInstrument || !instruments.some((item) => item.symbol === selectedInstrument)) {
            setSelectedInstrument(instruments[0].symbol);
        }
    }, [instruments, selectedInstrument]);

    const selectedPrediction = useMemo(() => {
        if (!selectedInstrument) return predictions[0];
        return (
            predictions.find((item) => item.instrument === selectedInstrument) ??
            predictions[0]
        );
    }, [predictions, selectedInstrument]);

    const summary = useMemo(() => {
        const portfolioValue = instruments.reduce(
            (total, item) => total + item.holdingValue,
            0,
        );

        const activeStocks = instruments.length;

        const gainers = instruments.filter((item) => item.changePercent > 0).length;

        const losers = instruments.filter((item) => item.changePercent < 0).length;

        return { portfolioValue, activeStocks, gainers, losers };
    }, [instruments]);

    const currentPrice = selectedPrediction?.past_price_history.at(-1)?.price ?? 0;
    const forecastReturn = selectedPrediction?.expected_return_pct ?? 0;
    const errorMessage =
        error && error instanceof AxiosError
            ? (error.response?.data?.detail as string | undefined) ?? error.message
            : error instanceof Error
                ? error.message
                : "Failed to load stock predictions.";

    const showInitialSkeletons = isFetching && !isError && instruments.length === 0;

    return (
        <div className="min-h-screen p-6 grid grid-cols-12 gap-6 relative">
            <section className="col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">My Instruments</h1>

                    <div className="bg-secondaryBG rounded-lg p-1 flex items-center gap-1">
                        {rangeOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setRange(option)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${option === range
                                    ? "bg-primary text-mainBG"
                                    : "text-textsecondary hover:text-textmain"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {showInitialSkeletons ? (
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonBlock key={index} className="h-[250px] rounded-2xl bg-secondaryBG" />
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {instruments.map((item, index) => (
                            <StockInstrumentCard
                                key={item.symbol}
                                symbol={item.symbol}
                                company={item.company}
                                price={item.price}
                                changePercent={item.changePercent}
                                holdingValue={item.holdingValue}
                                holdingAmount={item.holdingAmount}
                                active={item.symbol === selectedInstrument || (!selectedInstrument && index === 0)}
                                onClick={() => setSelectedInstrument(item.symbol)}
                            />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl bg-secondaryBG p-4 text-expense">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !isError && instruments.length === 0 && (
                    <div className="rounded-2xl bg-secondaryBG p-4 text-textsecondary">
                        No synced stock instruments found for this user.
                    </div>
                )}

                <div className="rounded-2xl bg-secondaryBG p-6 h-[600px] flex flex-col">
                    {showInitialSkeletons ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <SkeletonBlock className="h-8 w-44" />
                                    <SkeletonBlock className="h-5 w-64 mt-2" />
                                </div>
                                <SkeletonBlock className="h-6 w-20 rounded-md" />
                            </div>

                            <div className="mt-5 flex items-center gap-3">
                                <div className="rounded-lg bg-highlight px-3 py-2">
                                    <SkeletonBlock className="h-4 w-14" />
                                    <SkeletonBlock className="h-6 w-20 mt-2" />
                                </div>
                                <div className="rounded-lg bg-income/20 px-3 py-2">
                                    <SkeletonBlock className="h-4 w-24" />
                                    <SkeletonBlock className="h-6 w-20 mt-2" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-medium">Price Prediction</p>
                                    <p className="text-textsecondary mt-1">
                                        {selectedPrediction?.instrument ?? "--"} · {range} outlook based on recent trend
                                    </p>
                                </div>

                                <span className="text-xs rounded-md bg-primary/20 text-primary px-2 py-1 font-medium">
                                    AI Powered
                                </span>
                            </div>

                            <div className="mt-5 flex items-center gap-3">
                                <div className="rounded-lg bg-highlight px-3 py-2">
                                    <p className="text-xs text-textsecondary">Current</p>
                                    <p className="text-xl font-medium">${currentPrice.toFixed(2)}</p>
                                </div>
                                <div className="rounded-lg bg-income/20 px-3 py-2">
                                    <p className="text-xs text-textsecondary">Forecast Return</p>
                                    <p className={`text-xl font-medium ${forecastReturn >= 0 ? "text-income" : "text-expense"}`}>
                                        {forecastReturn >= 0 ? "+" : ""}
                                        {forecastReturn.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex-1 rounded-xl bg-highlight border border-accentBG p-2">
                        {showInitialSkeletons ? (
                            <SkeletonBlock className="h-full w-full rounded-xl bg-accentBG/40" />
                        ) : (
                            <StockPredictionChart
                                history={selectedPrediction?.past_price_history ?? []}
                                forecast={selectedPrediction?.future_price_prediction ?? []}
                            />
                        )}
                    </div>
                </div>
            </section>

            <aside className="col-span-3 space-y-4">
                {showInitialSkeletons ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonBlock key={index} className="h-[156px] rounded-3xl bg-secondaryBG" />
                    ))
                ) : (
                    <>
                        <StockSummaryCard
                            title="Portfolio Value"
                            value={summary.portfolioValue}
                            tone="primary"
                            icon={<FaCoins className="size-6 text-primary" />}
                        />

                        <StockSummaryCard
                            title="Active Stocks"
                            value={summary.activeStocks}
                            format="count"
                            tone="accent"
                            icon={<HiChartBar className="size-6 text-accent" />}
                        />

                        <StockSummaryCard
                            title="Gainers"
                            value={summary.gainers}
                            format="count"
                            tone="income"
                            icon={<HiTrendingUp className="size-6 text-income" />}
                        />

                        <StockSummaryCard
                            title="Losers"
                            value={summary.losers}
                            format="count"
                            tone="expense"
                            icon={<HiTrendingDown className="size-6 text-expense" />}
                        />
                    </>
                )}
            </aside>

            <LoadingOverlay show={isFetching} />
        </div>
    );
}
