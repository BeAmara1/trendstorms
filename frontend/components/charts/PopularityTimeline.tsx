"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PopularityTimelineProps {
  data: { date: string; value: number }[];
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

export default function PopularityTimeline({
  data,
  color = "#a855f7",
}: PopularityTimelineProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsAreaChart data={data}>
        <defs>
          <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
        <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(v) => v.slice(0, 10)} axisLine={false} tickLine={false} />
        <YAxis stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill="url(#popGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "#0B0F19", strokeWidth: 2 }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
