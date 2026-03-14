"use client";

import { ResponsivePie } from "@nivo/pie";
import React from "react";

interface PieChartProps {
  data: { id: string; value: number; label?: string }[];
  colors?: string[];
  onSliceClick?: (payload: { id: string; value: number; label?: string }) => void;
  width?: number | string;
  height?: number | string;
}

export default function PieChart({ data, colors, onSliceClick, width = "100%", height = 300 }: PieChartProps) {
  return (
    <div
      style={{
        width,
        height,
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
        onClick={(datum) => {
          if (!onSliceClick) return;

          onSliceClick({
            id: String(datum.id),
            value: datum.value,
            label: datum.label ? String(datum.label) : undefined,
          });
        }}
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
