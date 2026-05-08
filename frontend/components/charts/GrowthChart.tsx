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

export default function GrowthChart({
  data,
  showGrowth = false,
  color = "#a855f7",
}: GrowthChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={12}
          tickFormatter={(v) => v.slice(0, 10)}
          axisLine={{ stroke: "#1F2937" }}
          tickLine={false}
        />
        <YAxis
          stroke="#71717a"
          fontSize={12}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.toFixed(0)}
        />
        <Tooltip content={<CustomTooltip />} />
        {showGrowth && <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />}
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: "#0B0F19", strokeWidth: 2 }}
          name="Score"
        />
        {showGrowth && (
          <Line
            type="monotone"
            dataKey="growth"
            stroke="#06B6D4"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{ r: 4, fill: "#06B6D4" }}
            name="Growth"
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
