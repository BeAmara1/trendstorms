"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { GrowthChart, PopularityTimeline, RankingChart } from "@/components/charts";
import { TrendStats, GrowthBadge, HypeIndicator, MomentumCard } from "@/components/analytics";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
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
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {allTrends.loading ? (
          <Loading />
        ) : !trend ? (
          <ErrorState message="Trend not found" />
        ) : (
          <>
            <FadeIn>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20 capitalize">
                      {trend.category}
                    </span>
                    <span className="text-xs text-zinc-500 capitalize">{trend.source}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white">{trend.title}</h1>
                  <div className="flex items-center gap-4 mt-3">
                    <TrendStats score={trend.score} growth={trend.growth} />
                    <HypeIndicator score={trend.score} size="lg" />
                  </div>
                </div>
                <MomentumCard
                  title={trend.title}
                  growth={trend.growth}
                  score={trend.score}
                  subtitle={trend.category}
                />
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeIn delay={0.1}>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
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
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
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
                      color="#22d3ee"
                    />
                  )}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3}>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <h2 className="text-white text-sm font-semibold mb-4">Growth & Hype Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Score", value: trend.score.toFixed(0), color: "text-purple-400" },
                    { label: "Growth", value: `${trend.growth > 0 ? "+" : ""}${trend.growth.toFixed(1)}%`, color: trend.growth >= 0 ? "text-green-400" : "text-red-400" },
                    { label: "Hype Score", value: hypeEntry?.hype_score.toFixed(0) || "-", color: "text-cyan-400" },
                    { label: "Growth Rate", value: hypeEntry?.growth_rate ? `${hypeEntry.growth_rate.toFixed(1)}%` : "-", color: "text-yellow-400" },
                  ].map((m) => (
                    <div key={m.label} className="bg-zinc-800/50 rounded-lg p-4 text-center">
                      <p className="text-xs text-zinc-500 mb-1">{m.label}</p>
                      <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {hype.data && hype.data.length > 0 && (
              <FadeIn delay={0.4}>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                  <h2 className="text-white text-sm font-semibold mb-4">Ranking Position</h2>
                  <RankingChart
                    data={hype.data.slice(0, 10).map((h: any, i: number) => ({
                      rank: i + 1,
                      name: h.title,
                      value: h.hype_score,
                    }))}
                    color={trendId === 1 ? "#a855f7" : "#22d3ee"}
                  />
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
