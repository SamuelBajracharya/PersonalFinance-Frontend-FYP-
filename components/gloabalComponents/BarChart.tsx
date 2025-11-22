"use client";

import { ResponsiveBar, BarDatum } from "@nivo/bar";
import React from "react";

interface BarChartProps<T extends Record<string, string | number>> {
  data: T[];
  indexBy: keyof T;
  valueKey: keyof T;
}

export default function BarChart<T extends Record<string, string | number>>({
  data,
  indexBy,
  valueKey,
}: BarChartProps<T>) {
  const keys = [valueKey as string];

  return (
    <div style={{ height: 300 }}>
      {" "}
      {/* increased height */}
      <ResponsiveBar
        data={data as BarDatum[]}
        keys={keys}
        indexBy={indexBy as string}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
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
          axis: { ticks: { text: { fill: "#888", fontSize: 14 } } },
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
      />
    </div>
  );
}
