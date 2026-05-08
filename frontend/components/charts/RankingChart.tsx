"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RankingChartProps {
  data: { rank: number; name: string; value: number }[];
  color?: string;
  horizontal?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p className="text-zinc-400">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium tabular-nums">
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function RankingChart({
  data,
  color = "#a855f7",
  horizontal = true,
}: RankingChartProps) {
  if (!data.length) return null;

  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <RechartsBarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#71717a"
            fontSize={12}
            tickFormatter={(v) => (v.length > 18 ? `${v.slice(0, 18)}...` : v)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="rankBarGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <Bar dataKey="value" fill="url(#rankBarGrad)" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? color : `url(#rankBarGrad)`} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} vertical={false} />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
        <YAxis stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
