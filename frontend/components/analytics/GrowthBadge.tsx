"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface GrowthBadgeProps {
  value: number;
  className?: string;
}

export default function GrowthBadge({ value, className = "" }: GrowthBadgeProps) {
  if (value === 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-zinc-400 ${className}`}>
        <Minus className="w-3 h-3" /> Stable
      </span>
    );
  }

  const isPositive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isPositive ? "text-green-400" : "text-red-400"
      } ${className}`}
    >
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}
