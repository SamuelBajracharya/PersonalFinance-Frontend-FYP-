"use client";

import { Bar, BarDatum } from "@nivo/bar";
import React from "react";

// Minimum px per bar so labels never overlap; chart scrolls when exceeded
const MIN_BAR_WIDTH = 40;
const MIN_CHART_WIDTH = 500;
const CHART_HEIGHT = 300;
const LEFT_MARGIN = 50; // reserved for Y-axis

interface BarChartProps<T extends object> {
  data: T[];
  indexBy: keyof T;
  valueKey: keyof T;
  onBarClick?: (payload: {
    indexValue: string | number;
    value: number;
    key: string;
  }) => void;
}

export default function BarChart<T extends object>({
  data,
  indexBy,
  valueKey,
  onBarClick,
}: BarChartProps<T>) {
  const keys = [valueKey as string];

  // Compute a width that gives each bar at least MIN_BAR_WIDTH px
  const contentWidth = Math.max(
    MIN_CHART_WIDTH,
    data.length * MIN_BAR_WIDTH + LEFT_MARGIN + 20
  );

  // Only render every Nth label so they never overlap (target ≤12 visible)
  const skipFactor = Math.max(1, Math.ceil(data.length / 12));

  return (
    // Scrollable wrapper — only scrolls when contentWidth > container width
    <div
      style={{ overflowX: "auto", overflowY: "hidden" }}
      className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <div style={{ width: contentWidth, height: CHART_HEIGHT, minWidth: "100%" }}>
        <Bar
          width={contentWidth}
          height={CHART_HEIGHT}
          data={data as BarDatum[]}
          keys={keys}
          indexBy={indexBy as string}
          margin={{ top: 10, right: 20, bottom: 50, left: LEFT_MARGIN }}
          borderRadius={15}
          padding={0.4}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={["#3A7BFD"]}
          enableLabel={false}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            tickComponent: ({ x, y, value }) => {
              // Find this bar's index to apply the skip rule
              const idx = data.findIndex(
                (d) => String(d[indexBy as keyof T]) === String(value)
              );
              // Return empty element for skipped ticks
              if (idx % skipFactor !== 0) return <g />;

              const parts = typeof value === "string" ? value.split(" ") : [];
              const isMonthYear =
                parts.length === 2 && /^[A-Za-z]{3}$/.test(parts[0]);

              return (
                <g transform={`translate(${x},${y + 10})`}>
                  {isMonthYear ? (
                    <>
                      <text
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        style={{ fontSize: 11, fill: "#888" }}
                      >
                        {parts[0]}
                      </text>
                      <text
                        y={13}
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        style={{ fontSize: 11, fill: "#888" }}
                      >
                        {parts[1]}
                      </text>
                    </>
                  ) : (
                    <text
                      textAnchor="middle"
                      dominantBaseline="hanging"
                      style={{ fontSize: 11, fill: "#888" }}
                    >
                      {value}
                    </text>
                  )}
                </g>
              );
            },
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
          }}
          enableGridY
          gridYValues={6}
          theme={{
            grid: { line: { stroke: "rgba(255,255,255,0.08)" } },
            axis: { ticks: { text: { fill: "#888", fontSize: 13 } } },
          }}
          tooltip={({ value, indexValue }) => (
            <div
              style={{
                width: "100px",
                padding: "8px 10px",
                background: "#1A1A1A",
                color: "white",
                borderRadius: 8,
                fontSize: 13,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ opacity: 0.7 }}>{indexValue}</div>
              <div style={{ fontWeight: 600 }}>Total: {value}</div>
            </div>
          )}
          animate
          motionConfig="gentle"
          onClick={(bar) => {
            if (!onBarClick) return;

            const value =
              typeof bar.value === "number" ? bar.value : Number(bar.value);

            onBarClick({
              indexValue: bar.indexValue,
              value,
              key: String(bar.id),
            });
          }}
        />
      </div>
    </div>
  );
}

