"use client";

import { BarChart3, TrendingUp, Zap } from "lucide-react";
import GrowthBadge from "./GrowthBadge";

interface TrendStatsProps {
  score: number;
  growth: number;
  label?: string;
}

export default function TrendStats({ score, growth, label = "Score" }: TrendStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-sm">
        <Zap className="w-4 h-4 text-purple-400" />
        <span className="text-zinc-400">{label}:</span>
        <span className="text-white font-semibold">{score.toFixed(0)}</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <TrendingUp className="w-4 h-4 text-zinc-400" />
        <GrowthBadge value={growth} />
      </div>
    </div>
  );
}
