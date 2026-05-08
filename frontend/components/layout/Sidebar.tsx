"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Film,
  Music,
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/music", label: "Music", icon: Music },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 bg-zinc-950/80 backdrop-blur-lg border-r border-zinc-800/60 flex flex-col h-screen sticky top-0"
      aria-label="Main navigation"
    >
      <div className="p-6 border-b border-zinc-800/60">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white group"
          aria-label="Trendpulse home"
        >
          <div className="relative">
            <TrendingUp className="w-6 h-6 text-purple-500 transition-transform group-hover:scale-110 duration-200" />
            <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Trendpulse
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/40 border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800/60">
        <Link href="/about" className="text-xs text-zinc-600 hover:text-purple-400 transition-colors block mb-1">
          About
        </Link>
        <p className="text-xs text-zinc-600">Trendpulse v0.3.0</p>
        <p className="text-[10px] text-zinc-700 mt-0.5">Cultural Trends Monitor</p>
      </div>
    </aside>
  );
}
