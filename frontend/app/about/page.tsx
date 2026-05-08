"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Music,
  Film,
  Gamepad2,
  ExternalLink,
  Globe,
  Zap,
  Layers,
  LineChart,
  Sparkles,
  Database,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";

const features = [
  {
    icon: TrendingUp,
    title: "Hype Score Engine",
    desc: "Real-time scoring (0–100) from weighted growth, social buzz, and platform data.",
  },
  {
    icon: LineChart,
    title: "Growth Classification",
    desc: "Automatically classifies trends as Exploding, Rising, Stable, Declining, or Crashing.",
  },
  {
    icon: Zap,
    title: "Momentum Analysis",
    desc: "Measures velocity and acceleration from historical snapshots.",
  },
  {
    icon: BarChart3,
    title: "Trend Detection",
    desc: "Identifies explosive, viral, sustained, seasonal, and falling patterns with confidence.",
  },
  {
    icon: RefreshCw,
    title: "Cross-Platform Correlation",
    desc: "Pearson correlation between trends across Spotify, Steam, TMDB, and Google Trends.",
  },
  {
    icon: Clock,
    title: "Forecasting",
    desc: "Moving-average and linear-projection forecasts up to 30 steps ahead.",
  },
];

const dataSources = [
  { icon: Music, name: "Spotify", desc: "Top tracks & artists" },
  { icon: Gamepad2, name: "Steam / RAWG", desc: "Game popularity & player counts" },
  { icon: Film, name: "TMDB", desc: "Movie & TV trending scores" },
  { icon: Globe, name: "Google Trends", desc: "Search interest over time" },
];

const techStack = [
  { category: "Frontend", items: "Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts" },
  { category: "Backend", items: "Python 3.14, FastAPI, SQLAlchemy 2.0, APScheduler" },
  { category: "Database", items: "PostgreSQL, Alembic migrations" },
  { category: "Deploy", items: "Vercel (frontend), Render (backend), GitHub Actions (CI/CD)" },
  { category: "APIs", items: "Spotify, Steam, TMDB, RAWG, Google Trends" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-zinc-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/5 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="primary" className="mb-4">v0.3.0</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Trendpulse
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Real-time cultural trends analytics platform.
              Track what&apos;s trending across music, gaming, movies, and the web.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Live Dashboard
              </Link>
              <a
                href="https://github.com/yourusername/trendpulse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-purple-500/50 text-zinc-300 hover:text-white font-medium transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-12">
            Data Sources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dataSources.map((s, i) => (
              <GlassCard key={i} className="text-center p-6">
                <s.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <h3 className="font-semibold mb-1">{s.name}</h3>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-4">
            Analytics Engine
          </h2>
          <p className="text-zinc-500 text-center max-w-xl mx-auto mb-12">
            Six integrated engines that process raw data into actionable insights — no new DB tables needed.
          </p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <StaggerItem key={i}>
              <GlassCard className="p-6 h-full">
                <f.icon className="w-6 h-6 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Architecture */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-12">
            Architecture
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <GlassCard className="p-8">
            <div className="flex flex-col items-center text-sm font-mono text-zinc-400">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <span className="px-3 py-1 rounded bg-purple-600/20 text-purple-300 border border-purple-600/30">Spotify</span>
                <Layers className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-600/30">Steam</span>
                <Layers className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">TMDB</span>
                <Layers className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded bg-cyan-600/20 text-cyan-300 border border-cyan-600/30">RAWG</span>
                <Layers className="w-4 h-4 text-zinc-600" />
                <span className="px-3 py-1 rounded bg-amber-600/20 text-amber-300 border border-amber-600/30">Google Trends</span>
              </div>
              <Layers className="w-4 h-4 my-2" />
              <span className="px-4 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 mb-2">Collectors + Scheduler</span>
              <Layers className="w-4 h-4 my-2" />
              <span className="px-4 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 mb-2">PostgreSQL</span>
              <Layers className="w-4 h-4 my-2" />
              <span className="px-4 py-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 mb-2">FastAPI + Analytics Engine</span>
              <Layers className="w-4 h-4 my-2" />
              <span className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-600/30 text-purple-200">Next.js Dashboard</span>
            </div>
          </GlassCard>
        </FadeIn>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-12">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((t, i) => (
              <GlassCard key={i} className="p-6">
                <h3 className="font-semibold mb-2 text-purple-300">{t.category}</h3>
                <p className="text-sm text-zinc-400">{t.items}</p>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Automation */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-4">
            Fully Automated
          </h2>
          <p className="text-zinc-500 text-center max-w-xl mx-auto mb-12">
            The platform runs entirely on autopilot with 8 scheduled jobs.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Steam", cron: "Every 30min" },
              { label: "Spotify", cron: "Every 1h" },
              { label: "TMDB", cron: "Every 2h" },
              { label: "RAWG", cron: "Every 30min" },
              { label: "Google Trends", cron: "Every 4h" },
              { label: "Analytics", cron: "Every 1h" },
              { label: "Snapshots", cron: "Every 6h" },
              { label: "Cleanup", cron: "Every 24h" },
            ].map((j, i) => (
              <GlassCard key={i} className="p-4">
                <p className="font-semibold text-sm">{j.label}</p>
                <p className="text-xs text-zinc-500 mt-1">{j.cron}</p>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Production Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <FadeIn>
          <h2 className="text-2xl font-bold text-center mb-12">
            Production Ready
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Rate Limiting", desc: "100 req/min per IP" },
              { icon: Database, title: "PostgreSQL", desc: "With automated backups" },
              { icon: RefreshCw, title: "CI/CD", desc: "GitHub Actions pipeline" },
            ].map((p, i) => (
              <GlassCard key={i} className="p-6 text-center">
                <p.icon className="w-6 h-6 mx-auto mb-3 text-emerald-400" />
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-xs text-zinc-500">{p.desc}</p>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-4">Explore the Dashboard</h2>
          <p className="text-zinc-500 mb-8 max-w-lg mx-auto">
            See live trends, compare categories, and explore the analytics engine in action.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-600">
        <p>Built with Next.js, FastAPI, and PostgreSQL. Open source on GitHub.</p>
      </footer>
    </div>
  );
}
