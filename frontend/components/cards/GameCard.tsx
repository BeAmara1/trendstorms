"use client";

import { Users, Star } from "lucide-react";
import type { Game } from "@/types";

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-all">
      <h3 className="text-white font-semibold text-sm mb-3 truncate">{game.title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Players
          </span>
          <span className="text-zinc-300 font-medium">
            {game.steam_players.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Rating
          </span>
          <span className="text-yellow-400 font-medium">{game.rating.toFixed(1)}</span>
        </div>
        {game.genre && (
          <span className="inline-block text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full mt-2">
            {game.genre}
          </span>
        )}
      </div>
    </div>
  );
}
