"use client";

import { TrendingUp } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-white text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <TrendingUp className="w-4 h-4 text-purple-500" />
        <span>Cultural Trends</span>
      </div>
    </header>
  );
}
