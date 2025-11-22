"use client";

import { ResponsivePie } from "@nivo/pie";
import React from "react";

interface PieChartProps {
  data: { id: string; value: number; label?: string }[];
  colors?: string[];
}

export default function PieChart({ data, colors }: PieChartProps) {
  return (
    <div
      style={{
        height: 300,
        fontSize: 16,
      }}
    >
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        padAngle={0}
        activeOuterRadiusOffset={10}
        colors={colors || { scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        tooltip={({ datum }) => (
          <div
            style={{
              width: "120px",
              padding: "6px 10px",
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 600 }}>{datum.id}</div>
            <div>Total: {datum.value}</div>
          </div>
        )}
      />
    </div>
  );
}
