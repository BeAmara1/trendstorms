"use client";

import { usePathname } from "next/navigation";
import { TrendingUp, Activity } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/games": "Games",
  "/movies": "Movies & TV",
  "/music": "Music",
  "/analytics": "Analytics",
};

export default function Navbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/40 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-white text-lg font-semibold">{title}</h1>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">
          <Activity className="w-3 h-3 text-green-400" />
          Live
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <TrendingUp className="w-4 h-4 text-purple-500" />
        <span className="hidden sm:inline">Cultural Trends</span>
      </div>
    </header>
  );
}
