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
  "#8B5CF6", "#06B6D4", "#F43F5E", "#10B981",
  "#F59E0B", "#3B82F6", "#EC4899", "#14B8A6",
];

interface GenreDistributionChartProps {
  data: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p style={{ color: payload[0].color }} className="font-medium">{payload[0].name}</p>
      <p className="text-zinc-300 tabular-nums">{payload[0].value}</p>
    </div>
  );
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
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
          formatter={(value: string) => (
            <span className="text-zinc-400">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
