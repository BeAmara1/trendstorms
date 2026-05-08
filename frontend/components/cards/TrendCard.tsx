"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Trend } from "@/types";

const categoryColors: Record<string, string> = {
  music: "bg-green-500/10 text-green-400 border-green-500/20",
  game: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  movie: "bg-red-500/10 text-red-400 border-red-500/20",
  tv: "bg-red-500/10 text-red-400 border-red-500/20",
  artist: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  album: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  trending_search: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function TrendCard({ trend }: { trend: Trend }) {
  const colorClass = categoryColors[trend.category] || "bg-zinc-500/10 text-zinc-400";
  const GrowthIcon = trend.growth > 0 ? TrendingUp : trend.growth < 0 ? TrendingDown : Minus;
  const growthColor = trend.growth > 0 ? "text-green-400" : trend.growth < 0 ? "text-red-400" : "text-zinc-400";

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
          {trend.category}
        </span>
        <span className="text-2xl font-bold text-white">{trend.score}</span>
      </div>
      <h3 className="text-white font-semibold text-sm mb-1 truncate">{trend.title}</h3>
      <p className="text-xs text-zinc-500 mb-3 capitalize">{trend.source}</p>
      <div className={`flex items-center gap-1 text-xs ${growthColor}`}>
        <GrowthIcon className="w-3.5 h-3.5" />
        <span>{Math.abs(trend.growth)}%</span>
      </div>
    </div>
  );
}
