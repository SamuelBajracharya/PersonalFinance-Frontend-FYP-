"use client";

import React from "react";
import { ResponsiveLine } from "@nivo/line";

interface LineDatum {
  x: string | number;
  y: number;
}

interface LineSerie {
  id: string;
  data: LineDatum[];
}

interface LineChartProps {
  series: LineSerie[];
  onPointClick?: (payload: {
    seriesId: string;
    x: string | number;
    y: number;
  }) => void;
}

export default function LineChart({
  series = [],
  onPointClick,
}: LineChartProps) {
  const incomeIds = ["weekly_income", "monthly_income", "yearly_income"];

  return (
    <div style={{ height: 350 }}>
      <ResponsiveLine
        data={series}
        margin={{ top: 20, right: 40, bottom: 40, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0 }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 12, tickRotation: 0 }}
        axisLeft={{ tickSize: 0, tickPadding: 8, tickRotation: 0 }}
        enableGridX={false}
        enableGridY={true}
        gridYValues={6}
        theme={{
          grid: { line: { stroke: "rgba(255,255,255,0.08)" } },
          axis: { ticks: { text: { fill: "#888" } } },
        }}
        colors={(d) => (incomeIds.includes(d.id) ? "#40DCA3" : "#FF5A5A")}
        useMesh={true}
        animate
        motionConfig="gentle"
        enableSlices={false}
        enablePoints={Boolean(onPointClick)}
        pointSize={8}
        pointColor={{ from: "color" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "background" }}
        onClick={(point) => {
          if (!onPointClick) return;

          const y =
            typeof point.data.y === "number"
              ? point.data.y
              : Number(point.data.y);

          onPointClick({
            seriesId: String(point.serieId),
            x: point.data.x,
            y,
          });
        }}
        layers={[
          "grid",
          "axes",
          "slices",
          // Custom shadow layer
          ({ series: lineSeries }: any) =>
            lineSeries.map((line: any) => (
              <path
                key={line.id + "-shadow"}
                d={line.path}
                fill="none"
                stroke={line.color}
                strokeWidth={10} // thicker than main line
                strokeLinecap="round"
                opacity={0.2} // shadow intensity
                transform="translate(0, 4)" // offset down a few pixels
              />
            )),
          "lines", // draw main line on top
          "points",
        ]}
      />
    </div>
  );
}
