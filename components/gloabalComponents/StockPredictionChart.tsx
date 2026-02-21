"use client";

import { ResponsiveLine } from "@nivo/line";
import { FuturePricePoint, PastPricePoint } from "@/api/stockPredictionAPI";

interface StockPredictionChartProps {
    history: PastPricePoint[];
    forecast: FuturePricePoint[];
}

export default function StockPredictionChart({
    history,
    forecast,
}: StockPredictionChartProps) {
    if (!history.length) {
        return (
            <div className="h-full rounded-xl bg-highlight border border-accentBG flex items-center justify-center">
                <p className="text-textsecondary">No chart data available</p>
            </div>
        );
    }

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    });

    const historyLabels = history.map((point) =>
        dateFormatter.format(new Date(point.date)),
    );

    const forecastLabels = forecast.map((point) => `D+${point.day}`);
    const labels = [...historyLabels, ...forecastLabels];

    const actualSeries = {
        id: "actual_price",
        data: history.map((point, index) => ({
            x: index,
            y: point.price,
        })),
    };

    const lastHistoryIndex = history.length - 1;
    const lastHistoryPrice = history[lastHistoryIndex]?.price ?? 0;

    const predictedSeries = {
        id: "predicted_price",
        data: [
            { x: lastHistoryIndex, y: lastHistoryPrice },
            ...forecast.map((point) => ({
                x: lastHistoryIndex + point.day,
                y: point.price,
            })),
        ],
    };

    const maxX = Math.max(history.length + forecast.length - 1, 1);
    const minY = Math.min(
        ...history.map((point) => point.price),
        ...(forecast.length ? forecast.map((point) => point.price) : [lastHistoryPrice]),
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden rounded-lg">
                <ResponsiveLine
                    data={[actualSeries, predictedSeries]}
                    margin={{ top: 8, right: 12, bottom: 34, left: 34 }}
                    xScale={{ type: "linear", min: 0, max: maxX }}
                    yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 0,
                        tickPadding: 8,
                        tickRotation: 0,
                        tickValues: 6,
                        format: (value) => labels[Math.round(Number(value))] ?? "",
                    }}
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 8,
                        tickRotation: 0,
                        format: (value) => `${Number(value).toFixed(0)}`,
                    }}
                    enableGridX={true}
                    enableGridY={true}
                    gridXValues={10}
                    gridYValues={6}
                    theme={{
                        grid: { line: { stroke: "rgba(255,255,255,0.08)" } },
                        axis: { ticks: { text: { fill: "#7a7a7a", fontSize: 10 } } },
                        crosshair: { line: { stroke: "#666", strokeWidth: 1 } },
                    }}
                    colors={(d) => (d.id === "actual_price" ? "#ff8a1e" : "#12d6a0")}
                    lineWidth={3}
                    enablePoints={false}
                    useMesh={true}
                    animate
                    motionConfig="gentle"
                    enableArea={true}
                    areaBaselineValue={minY}
                    areaOpacity={0.13}
                    tooltip={({ point }) => {
                        const pointX = Number(point.data.x);
                        const isHistoryPoint = pointX <= lastHistoryIndex;
                        const label = isHistoryPoint
                            ? labels[Math.round(pointX)] ?? "--"
                            : `D+${Math.round(pointX - lastHistoryIndex)}`;

                        return (
                            <div className="rounded-md border border-accentBG bg-secondaryBG px-3 py-2 text-xs shadow-md">
                                <p className="text-textsecondary">{label}</p>
                                <p className="mt-1 text-textmain font-medium">
                                    {point.seriesId === "actual_price" ? "Actual" : "Predicted"}: ${Number(point.data.y).toFixed(2)}
                                </p>
                            </div>
                        );
                    }}
                    legends={[]}
                />
            </div>

            <div className="mt-1 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="h-[3px] w-4 rounded-full bg-[#ff8a1e]" />
                    <span className="text-xs text-textsecondary">Actual Price</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-[3px] w-4 rounded-full bg-[#12d6a0]" />
                    <span className="text-xs text-textsecondary">Predicted Price</span>
                </div>
            </div>
        </div>
    );
}
