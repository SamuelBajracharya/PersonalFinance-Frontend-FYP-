"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Tour } from "antd";
import { HiChartBar, HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { FaCoins } from "react-icons/fa";
import StockInstrumentCard from "@/components/gloabalComponents/StockInstrumentCard";
import StockSummaryCard from "@/components/gloabalComponents/StockSummaryCard";
import StockPredictionChart from "@/components/gloabalComponents/StockPredictionChart";
import LoadingOverlay from "@/components/gloabalComponents/LoadingOverlay";
import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";
import { useStockPredictions } from "@/hooks/useStockPrediction";
import { useTourStore } from "@/stores/useTour";

type RangeFilter = "1W" | "1M" | "3M" | "1Y";

const rangeOptions: RangeFilter[] = ["1W", "1M", "3M", "1Y"];

const rangeToHorizon: Record<RangeFilter, number> = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1Y": 365,
};

const getCurrencySymbol = (currency?: string) =>
    currency?.toUpperCase() === "RS" ? "Rs." : "$";

export default function MyStocksPage() {
    const [range, setRange] = useState<RangeFilter>("1M");
    const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
    const {
        isMyStocksTour,
        initialize: initializeTour,
        setMyStocksTour,
    } = useTourStore();

    const rangeRef = useRef<HTMLDivElement | null>(null);
    const instrumentsRef = useRef<HTMLDivElement | null>(null);
    const predictionHeaderRef = useRef<HTMLDivElement | null>(null);
    const predictionChartRef = useRef<HTMLDivElement | null>(null);
    const portfolioValueRef = useRef<HTMLDivElement | null>(null);
    const activeStocksRef = useRef<HTMLDivElement | null>(null);
    const gainersRef = useRef<HTMLDivElement | null>(null);
    const losersRef = useRef<HTMLDivElement | null>(null);

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
                    currency: item.currency,
                };
            }),
        [predictions],
    );

    useEffect(() => {
        initializeTour();
    }, [initializeTour]);

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
    const selectedCurrencySymbol = getCurrencySymbol(selectedPrediction?.currency);
    const portfolioCurrencySymbol = getCurrencySymbol(instruments[0]?.currency);
    const errorMessage =
        error && error instanceof AxiosError
            ? (error.response?.data?.detail as string | undefined) ?? error.message
            : error instanceof Error
                ? error.message
                : "Failed to load stock predictions.";

    const showInitialSkeletons = isFetching && !isError && instruments.length === 0;
    const shouldOpenMyStocksTour = isMyStocksTour && !showInitialSkeletons;

    const resolveTarget = (element: HTMLElement | null): HTMLElement =>
        element ?? document.body;

    const myStocksTourSteps = [
        {
            title: "Time Horizon",
            description:
                "Switch between 1W, 1M, 3M, and 1Y to change stock prediction horizon.",
            target: () => resolveTarget(rangeRef.current),
        },
        {
            title: "Instruments",
            description:
                "Pick any synced instrument card to update the prediction chart and metrics.",
            target: () => resolveTarget(instrumentsRef.current),
        },
        {
            title: "Prediction Overview",
            description:
                "This section shows the selected symbol, current price, and projected return.",
            target: () => resolveTarget(predictionHeaderRef.current),
        },
        {
            title: "Prediction Chart",
            description:
                "Visual comparison of historical prices and AI forecast for the selected horizon.",
            target: () => resolveTarget(predictionChartRef.current),
        },
        {
            title: "Portfolio Value",
            description:
                "Total current value of your tracked stock holdings.",
            target: () => resolveTarget(portfolioValueRef.current),
        },
        {
            title: "Active Stocks",
            description:
                "Count of instruments currently included in your stock prediction view.",
            target: () => resolveTarget(activeStocksRef.current),
        },
        {
            title: "Gainers",
            description:
                "Number of stocks with positive expected return.",
            target: () => resolveTarget(gainersRef.current),
        },
        {
            title: "Losers",
            description:
                "Number of stocks with negative expected return.",
            target: () => resolveTarget(losersRef.current),
        },
    ];

    return (
        <div className="min-h-screen p-6 grid grid-cols-12 gap-6 relative">
            <section className="col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">My Instruments</h1>

                    <div ref={rangeRef} className="bg-secondaryBG rounded-lg p-1 flex items-center gap-1">
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
                            <SkeletonBlock key={index} className="h-[250px] rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div ref={instrumentsRef} className="flex gap-4 overflow-x-auto pb-2">
                        {instruments.map((item, index) => (
                            <StockInstrumentCard
                                key={item.symbol}
                                symbol={item.symbol}
                                company={item.company}
                                price={item.price}
                                changePercent={item.changePercent}
                                holdingValue={item.holdingValue}
                                holdingAmount={item.holdingAmount}
                                currencySymbol={getCurrencySymbol(item.currency)}
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
                            <div ref={predictionHeaderRef} className="flex items-center justify-between">
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
                                    <p className="text-xl font-medium">{selectedCurrencySymbol}{currentPrice.toFixed(2)}</p>
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

                    <div ref={predictionChartRef} className="mt-6 flex-1 rounded-xl bg-highlight border border-accentBG p-2">
                        {showInitialSkeletons ? (
                            <SkeletonBlock className="h-full w-full rounded-xl" />
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
                        <SkeletonBlock key={index} className="h-[156px] rounded-3xl" />
                    ))
                ) : (
                    <>
                        <div ref={portfolioValueRef}>
                            <StockSummaryCard
                                title="Portfolio Value"
                                value={summary.portfolioValue}
                                currencySymbol={portfolioCurrencySymbol}
                                tone="primary"
                                icon={<FaCoins className="size-6 text-primary" />}
                            />
                        </div>

                        <div ref={activeStocksRef}>
                            <StockSummaryCard
                                title="Active Stocks"
                                value={summary.activeStocks}
                                format="count"
                                tone="accent"
                                icon={<HiChartBar className="size-6 text-accent" />}
                            />
                        </div>

                        <div ref={gainersRef}>
                            <StockSummaryCard
                                title="Gainers"
                                value={summary.gainers}
                                format="count"
                                tone="income"
                                icon={<HiTrendingUp className="size-6 text-income" />}
                            />
                        </div>

                        <div ref={losersRef}>
                            <StockSummaryCard
                                title="Losers"
                                value={summary.losers}
                                format="count"
                                tone="expense"
                                icon={<HiTrendingDown className="size-6 text-expense" />}
                            />
                        </div>
                    </>
                )}
            </aside>

            <LoadingOverlay show={isFetching} />
            <Tour
                open={shouldOpenMyStocksTour}
                onClose={() => setMyStocksTour(false)}
                onFinish={() => setMyStocksTour(false)}
                steps={myStocksTourSteps}
                zIndex={24354654}
                rootClassName="!z-[24354654]"
            />
        </div>
    );
}
