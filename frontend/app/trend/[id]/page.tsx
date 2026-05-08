"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { GrowthChart, PopularityTimeline, RankingChart } from "@/components/charts";
import { TrendStats, GrowthBadge, HypeIndicator, MomentumCard } from "@/components/analytics";
import GlassCard from "@/components/ui/GlassCard";
import HeroSection from "@/components/ui/HeroSection";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/Animated";
import { SkeletonCard, SkeletonChart } from "@/components/ui/Skeleton";
import { Loading } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchTrendHistory, fetchHypeScores, fetchTopTrends } from "@/services/api";

export default function TrendDetailPage() {
  const params = useParams();
  const trendId = Number(params.id);

  const allTrends = useAsync(() => fetchTopTrends({ limit: 50 }), []);
  const trend = allTrends.data?.find((t: any) => t.id === trendId);
  const history = useAsync(
    () => (trendId ? fetchTrendHistory(trendId) : Promise.resolve([])),
    [trendId]
  );
  const hype = useAsync(() => fetchHypeScores({ limit: 10 }), []);

  const hypeEntry = hype.data?.find((h: any) => h.title === trend?.title);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {allTrends.loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonChart />
              <SkeletonChart />
            </div>
          </div>
        ) : !trend ? (
          <ErrorState message="Trend not found" />
        ) : (
          <>
            <HeroSection
              title={trend.title}
              subtitle={`${trend.category} · ${trend.source}`}
              badge={
                trend.growth > 50
                  ? { variant: "exploding", label: "Exploding" }
                  : trend.growth > 10
                  ? { variant: "rising", label: "Rising" }
                  : trend.growth < -50
                  ? { variant: "crashing", label: "Crashing" }
                  : undefined
              }
              growth={trend.growth}
              metric={{ label: "Score", value: trend.score, decimals: 0, suffix: " pts" }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeIn delay={0.1}>
                <GlassCard>
                  <h2 className="text-white text-sm font-semibold mb-4">Score History</h2>
                  {history.loading ? (
                    <Loading />
                  ) : !history.data?.length ? (
                    <EmptyState message="No historical data" />
                  ) : (
                    <GrowthChart
                      data={history.data.map((h: any) => ({
                        date: h.date,
                        score: h.score,
                        growth: h.growth,
                      }))}
                      showGrowth
                    />
                  )}
                </GlassCard>
              </FadeIn>

              <FadeIn delay={0.2}>
                <GlassCard>
                  <h2 className="text-white text-sm font-semibold mb-4">Popularity Timeline</h2>
                  {history.loading ? (
                    <Loading />
                  ) : !history.data?.length ? (
                    <EmptyState message="No historical data" />
                  ) : (
                    <PopularityTimeline
                      data={history.data.map((h: any) => ({
                        date: h.date,
                        value: h.score,
                      }))}
                      color="#06B6D4"
                    />
                  )}
                </GlassCard>
              </FadeIn>
            </div>

            <FadeIn delay={0.3}>
              <GlassCard>
                <h2 className="text-white text-sm font-semibold mb-4">Growth & Hype Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Score", value: trend.score.toFixed(0), color: "text-purple-400" },
                    { label: "Growth", value: `${trend.growth > 0 ? "+" : ""}${trend.growth.toFixed(1)}%`, color: trend.growth >= 0 ? "text-green-400" : "text-red-400" },
                    { label: "Hype Score", value: hypeEntry?.hype_score.toFixed(0) || "-", color: "text-cyan-400" },
                    { label: "Growth Rate", value: hypeEntry?.growth_rate ? `${hypeEntry.growth_rate.toFixed(1)}%` : "-", color: "text-yellow-400" },
                  ].map((m) => (
                    <div key={m.label} className="bg-zinc-800/40 rounded-lg p-4 text-center">
                      <p className="text-xs text-zinc-500 mb-1">{m.label}</p>
                      <p className={`text-lg font-bold tabular-nums ${m.color}`}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>

            {hype.data && hype.data.length > 0 && (
              <FadeIn delay={0.4}>
                <GlassCard>
                  <h2 className="text-white text-sm font-semibold mb-4">Ranking Position</h2>
                  <RankingChart
                    data={hype.data.slice(0, 10).map((h: any, i: number) => ({
                      rank: i + 1,
                      name: h.title,
                      value: h.hype_score,
                    }))}
                    color="#8B5CF6"
                  />
                </GlassCard>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
