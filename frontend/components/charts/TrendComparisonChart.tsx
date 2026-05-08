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

const COLORS = ["#a855f7", "#22d3ee", "#f43f5e", "#10b981", "#f59e0b"];

interface TrendComparisonChartProps {
  data: { date: string; [key: string]: number | string }[];
  trends: string[];
}

export default function TrendComparisonChart({
  data,
  trends,
}: TrendComparisonChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={360}>
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
        <Legend />
        {trends.map((trend, i) => (
          <Line
            key={trend}
            type="monotone"
            dataKey={trend}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={trend}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
