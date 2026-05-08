"use client";

import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import Badge from "./Badge";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  metric?: {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  };
  badge?: {
    variant: string;
    label: string;
  };
  growth?: number;
  loading?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  metric,
  badge: heroBadge,
  growth,
}: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/10 via-zinc-900 to-cyan-600/10 border border-purple-500/20 p-6 md:p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {heroBadge && (
              <Badge variant={heroBadge.variant}>{heroBadge.label}</Badge>
            )}
          </div>
          <p className="text-zinc-400 text-sm md:text-base">{subtitle}</p>
          {growth !== undefined && (
            <div className="flex items-center gap-1.5 text-sm">
              {growth >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">+{growth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-semibold">{growth.toFixed(1)}%</span>
                </>
              )}
              <span className="text-zinc-500 ml-1">vs last period</span>
            </div>
          )}
        </div>

        {metric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 bg-zinc-900/60 rounded-xl px-5 py-3 border border-zinc-800"
          >
            <Zap className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-right">
              <p className="text-xs text-zinc-500">{metric.label}</p>
              <p className="text-xl font-bold text-white">
                <AnimatedCounter
                  from={0}
                  to={metric.value}
                  decimals={metric.decimals ?? 1}
                  suffix={metric.suffix ?? ""}
                  prefix={metric.prefix ?? ""}
                />
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
