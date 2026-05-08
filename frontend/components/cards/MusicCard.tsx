"use client";

import { Headphones, BarChart3 } from "lucide-react";
import type { Music } from "@/types";

export default function MusicCard({ item }: { item: Music }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-2">
        <Headphones className="w-4 h-4 text-green-400" />
        <span className="text-lg font-bold text-white">{item.popularity}</span>
      </div>
      <h3 className="text-white font-semibold text-sm truncate">{item.track_name}</h3>
      <p className="text-xs text-zinc-400 mb-3 truncate">{item.artist_name}</p>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <BarChart3 className="w-3.5 h-3.5" />
        <span>Popularity: {item.popularity}</span>
      </div>
    </div>
  );
}
