"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GrowthChartProps {
  data: { date: string; score: number; growth?: number }[];
  showGrowth?: boolean;
  color?: string;
}

export default function GrowthChart({
  data,
  showGrowth = false,
  color = "#a855f7",
}: GrowthChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={12}
          tickFormatter={(v) => v.slice(0, 10)}
        />
        <YAxis stroke="#71717a" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#e4e4e7",
          }}
        />
        {showGrowth && <Legend />}
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
          name="Score"
        />
        {showGrowth && (
          <Line
            type="monotone"
            dataKey="growth"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            name="Growth"
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
