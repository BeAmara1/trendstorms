"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#a855f7", "#22d3ee", "#f43f5e", "#10b981",
  "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6",
];

interface GenreDistributionChartProps {
  data: { name: string; value: number }[];
}

export default function GenreDistributionChart({
  data,
}: GenreDistributionChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#e4e4e7",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
