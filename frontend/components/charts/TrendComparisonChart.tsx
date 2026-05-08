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

const COLORS = ["#8B5CF6", "#06B6D4", "#F43F5E", "#10B981", "#F59E0B"];

interface TrendComparisonChartProps {
  data: { date: string; [key: string]: number | string }[];
  trends: string[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p className="text-zinc-400">{label?.slice(0, 10)}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium tabular-nums">
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function TrendComparisonChart({
  data,
  trends,
}: TrendComparisonChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
        <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(v) => v.slice(0, 10)} axisLine={false} tickLine={false} />
        <YAxis stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
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
