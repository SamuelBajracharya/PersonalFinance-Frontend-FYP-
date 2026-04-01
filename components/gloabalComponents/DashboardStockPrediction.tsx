import React from "react";

interface TopStock {
    id: string;
    symbol: string;
    name: string;
    quantity: string;
    currentPrice: string;
    averageBuyPrice: string;
    marketValue: string;
}

interface DashboardStockPredictionProps {
    stocks: TopStock[];
}

const DashboardStockPrediction = ({ stocks }: DashboardStockPredictionProps) => {
    const topTwo = stocks.slice(0, 2);

    return (
        <div className="bg-secondaryBG rounded-2xl p-2.5 h-full">
            <div className="space-y-3">
                {topTwo.length === 0 ? (
                    <p className="text-textsecondary text-sm">No stocks available.</p>
                ) : (
                    topTwo.map((stock) => {
                        const current = Number(stock.currentPrice || 0);
                        const average = Number(stock.averageBuyPrice || 0);
                        const ratio = average > 0 ? (current / average) * 100 : 0;
                        const clamped = Math.max(0, Math.min(100, ratio));
                        const positive = current >= average;

                        return (
                            <div key={stock.id} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">{stock.symbol}</p>
                                    <p className={`text-xs ${positive ? "text-income" : "text-expense"}`}>
                                        {positive ? "Uptrend" : "Downtrend"}
                                    </p>
                                </div>

                                <p className="text-xs text-textsecondary truncate">{stock.name}</p>

                                <div className="h-2 bg-accentBG rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${positive ? "bg-accent" : "bg-expense"}`}
                                        style={{ width: `${clamped}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs text-textsecondary">
                                    <span>Avg Rs. {average.toFixed(2)}</span>
                                    <span>Now Rs. {current.toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DashboardStockPrediction;
