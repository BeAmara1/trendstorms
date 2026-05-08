"use client";

import { Star, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { Movie } from "@/types";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full capitalize">
          {movie.media_type}
        </span>
        <span className="flex items-center gap-1 text-yellow-400 text-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400" />
          <span className="tabular-nums">{movie.rating.toFixed(1)}</span>
        </span>
      </div>
      <h3 className="text-white font-semibold text-sm mb-3 truncate">{movie.title}</h3>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="tabular-nums">Popularity: {movie.popularity.toFixed(0)}</span>
      </div>
    </GlassCard>
  );
}
