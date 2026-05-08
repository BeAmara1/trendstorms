"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";

interface MomentumCardProps {
  title: string;
  growth: number;
  score: number;
  subtitle?: string;
}

export default function MomentumCard({
  title,
  growth,
  score,
  subtitle,
}: MomentumCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-400" />
        </div>
        <span className="inline-flex items-center gap-1 text-green-400 text-sm font-semibold">
          <ArrowUpRight className="w-4 h-4" />
          {growth.toFixed(1)}%
        </span>
      </div>
      <h3 className="text-white font-semibold text-sm">{title}</h3>
      {subtitle && (
        <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
        <span className="text-xs text-zinc-400">{score.toFixed(0)}</span>
      </div>
    </div>
  );
}
