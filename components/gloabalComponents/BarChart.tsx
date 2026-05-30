"use client";

import { Bar, BarDatum } from "@nivo/bar";
import React, { useEffect, useRef, useState } from "react";

// Minimum px per bar so labels never overlap; chart scrolls when exceeded
const MIN_BAR_WIDTH = 60;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const keys = [valueKey as string];

  const getMonthYearLines = (raw: unknown) => {
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim();

    // Match formats like "Dec 2025", "Dec-2025", "Dec/2025", "December 2025"
    const monthYearMatch = trimmed.match(
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s/-]+(\d{4})$/i
    );

    if (monthYearMatch) {
      return {
        line1: monthYearMatch[1],
        line2: monthYearMatch[2],
      };
    }

    return null;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute a width that gives each bar at least MIN_BAR_WIDTH px
  const contentWidth = Math.max(
    MIN_CHART_WIDTH,
    data.length * MIN_BAR_WIDTH + LEFT_MARGIN + 20
  );

  const chartWidth = Math.max(contentWidth, containerWidth || 0);

  return (
    // Scrollable wrapper — only scrolls when contentWidth > container width
    <div
      style={{ overflowX: "auto", overflowY: "hidden" }}
      className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <div
        ref={containerRef}
        style={{ width: chartWidth, height: CHART_HEIGHT, minWidth: "100%" }}
      >
        <Bar
          width={chartWidth}
          height={CHART_HEIGHT}
          data={data as BarDatum[]}
          keys={keys}
          indexBy={indexBy as string}
          margin={{ top: 10, right: 20, bottom: 60, left: LEFT_MARGIN }}
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
              const monthYearLines = getMonthYearLines(value);

              return (
                <g transform={`translate(${x},${y + 10})`}>
                  {monthYearLines ? (
                    <>
                      <text
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        style={{ fontSize: 11, fill: "#888" }}
                      >
                        {monthYearLines.line1}
                      </text>
                      <text
                        y={13}
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        style={{ fontSize: 11, fill: "#888" }}
                      >
                        {monthYearLines.line2}
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

