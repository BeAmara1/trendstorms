"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  GrowthChart,
  RankingChart,
  GenreDistributionChart,
  PopularityTimeline,
} from "@/components/charts";
import { TrendComparison } from "@/components/comparisons";
import { FilterBar } from "@/components/filters";
import { TrendStats, HypeIndicator, GrowthBadge, MomentumCard } from "@/components/analytics";
import HeroSection from "@/components/ui/HeroSection";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/Animated";
import { SkeletonCard, SkeletonChart, SkeletonTable, SkeletonHero } from "@/components/ui/Skeleton";
import { Loading } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import {
  fetchHypeScores,
  fetchTopGrowing,
  fetchTrendHistory,
  fetchTopTrends,
  fetchExploding,
  fetchMomentum,
  fetchCorrelations,
  fetchInsights,
} from "@/services/api";
import type { TimePeriod } from "@/components/filters";
import { TrendingUp, TrendingDown, Zap, BarChart3, Layers, Lightbulb } from "lucide-react";

const classificationColors: Record<string, string> = {
  exploding: "text-green-400 bg-green-500/10 border-green-500/30",
  rising: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  stable: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
  declining: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  crashing: "text-red-400 bg-red-500/10 border-red-500/30",
};

const momentumColors: Record<string, string> = {
  accelerating: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  high: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  decelerating: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
};

function ClassificationBadge({ classification }: { classification: string }) {
  const color = classificationColors[classification] || classificationColors.stable;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {classification}
    </span>
  );
}

function MomentumBadge({ momentum }: { momentum: string }) {
  const color = momentumColors[momentum] || momentumColors.low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {momentum}
    </span>
  );
}

export default function AnalyticsPage() {
  const [selectedTrendId, setSelectedTrendId] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [time, setTime] = useState<TimePeriod>("all");

  const hype = useAsync(() => fetchHypeScores({ limit: 15 }), []);
  const growth = useAsync(() => fetchTopGrowing({ limit: 10 }), []);
  const trends = useAsync(() => fetchTopTrends({ category: category || undefined, limit: 30 }), [category]);
  const history = useAsync(
    () => (selectedTrendId ? fetchTrendHistory(selectedTrendId) : Promise.resolve([])),
    [selectedTrendId]
  );
  const exploding = useAsync(() => fetchExploding({ limit: 10 }), []);
  const momentum = useAsync(() => fetchMomentum({ limit: 10 }), []);
  const correlations = useAsync(() => fetchCorrelations({ threshold: 0.3 }), []);
  const insights = useAsync(() => fetchInsights({ limit: 5 }), []);

  const selectedTrend = trends.data?.find((t: any) => t.id === selectedTrendId);

  const genreData: Record<string, number> = {};
  (trends.data || []).forEach((t: any) => {
    genreData[t.category] = (genreData[t.category] || 0) + 1;
  });

  const genreChart: { name: string; value: number }[] = Object.entries(genreData).map(
    ([name, value]) => ({ name, value: value as number })
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <HeroSection
          title="Analytics"
          subtitle="Hype scores, growth trends, and historical data"
          metric={hype.data?.[0] ? { label: "Top Hype Score", value: hype.data[0].hype_score, decimals: 1, suffix: " pts" } : undefined}
        />

        {/* Insights */}
        <FadeIn delay={0.08}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> Insights
            </h2>
            {insights.loading ? (
              <SkeletonCard />
            ) : insights.error ? (
              <ErrorState message={insights.error} onRetry={insights.refetch} />
            ) : (
              <GlassCard>
                <div className="space-y-3">
                  {insights.data?.trend_insights?.map((insight: string, i: number) => (
                    <p key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5 shrink-0 text-xs">&#9654;</span>
                      {insight}
                    </p>
                  ))}
                  {insights.data?.correlation_insights?.map((insight: string, i: number) => (
                    <p key={`corr-${i}`} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5 shrink-0 text-xs">&#9670;</span>
                      {insight}
                    </p>
                  ))}
                  {!insights.data?.trend_insights?.length && !insights.data?.correlation_insights?.length && (
                    <p className="text-zinc-500 text-sm">No insights available yet</p>
                  )}
                </div>
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Hype Score Rankings */}
        <FadeIn delay={0.1}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Hype Score Rankings</h2>
            {hype.loading ? (
              <SkeletonChart />
            ) : hype.error ? (
              <ErrorState message={hype.error} onRetry={hype.refetch} />
            ) : !hype.data?.length ? (
              <EmptyState />
            ) : (
              <GlassCard>
                <RankingChart
                  data={hype.data.map((h: any, i: number) => ({
                    rank: i + 1,
                    name: h.title,
                    value: h.hype_score,
                  }))}
                  color="#8B5CF6"
                />
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Growth Classification */}
        <FadeIn delay={0.12}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" /> Growth Classification
            </h2>
            {exploding.loading ? (
              <SkeletonTable />
            ) : exploding.error ? (
              <ErrorState message={exploding.error} onRetry={exploding.refetch} />
            ) : !exploding.data?.length ? (
              <EmptyState message="No exploding trends found" />
            ) : (
              <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left text-zinc-400 font-medium px-4 py-3">Title</th>
                        <th className="text-left text-zinc-400 font-medium px-4 py-3">Category</th>
                        <th className="text-right text-zinc-400 font-medium px-4 py-3">Growth</th>
                        <th className="text-right text-zinc-400 font-medium px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exploding.data?.map((item) => (
                        <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-white font-medium">{item.title}</td>
                          <td className="px-4 py-3 text-zinc-400 capitalize">{item.category}</td>
                          <td className="px-4 py-3 text-right">
                            <GrowthBadge value={item.growth} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ClassificationBadge classification={item.classification} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Momentum */}
        <FadeIn delay={0.14}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" /> Momentum
            </h2>
            {momentum.loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : momentum.error ? (
              <ErrorState message={momentum.error} onRetry={momentum.refetch} />
            ) : !momentum.data?.length ? (
              <EmptyState message="No momentum data available" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentum.data?.map((item) => (
                  <MomentumCard
                    key={item.id}
                    title={item.title}
                    growth={item.velocity}
                    score={Math.max(0, item.velocity * 10)}
                    subtitle={`${item.momentum} · accel: ${item.acceleration.toFixed(1)}`}
                  />
                ))}
              </div>
            )}
          </section>
        </FadeIn>

        {/* Cross-Platform Correlations */}
        <FadeIn delay={0.16}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Cross-Platform Correlations
            </h2>
            {correlations.loading ? (
              <SkeletonTable />
            ) : correlations.error ? (
              <ErrorState message={correlations.error} onRetry={correlations.refetch} />
            ) : !correlations.data?.length ? (
              <EmptyState message="No cross-platform correlations found" />
            ) : (
              <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left text-zinc-400 font-medium px-4 py-3">Title</th>
                        <th className="text-left text-zinc-400 font-medium px-4 py-3">Sources</th>
                        <th className="text-right text-zinc-400 font-medium px-4 py-3">Avg Growth</th>
                        <th className="text-right text-zinc-400 font-medium px-4 py-3">Correlation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correlations.data?.map((item, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 text-white font-medium">{item.title}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {item.sources.map((s: string) => (
                                <Badge key={s} variant="stable" dot={false}>
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <GrowthBadge value={item.avg_growth} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-purple-400 font-semibold tabular-nums">
                              {(item.correlation_score * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Genre Distribution */}
        {genreChart.length > 0 && (
          <FadeIn delay={0.15}>
            <section>
              <h2 className="text-white text-lg font-semibold mb-4">Category Distribution</h2>
              <GlassCard>
                <GenreDistributionChart data={genreChart} />
              </GlassCard>
            </section>
          </FadeIn>
        )}

        {/* Growth Rates */}
        <FadeIn delay={0.2}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Growth Rates</h2>
            {growth.loading ? (
              <SkeletonChart />
            ) : growth.error ? (
              <ErrorState message={growth.error} onRetry={growth.refetch} />
            ) : !growth.data?.length ? (
              <EmptyState />
            ) : (
              <GlassCard>
                <PopularityTimeline
                  data={growth.data.map((g: any, i: number) => ({
                    date: `#${i + 1} ${g.title}`,
                    value: g.growth_rate,
                  }))}
                  color="#06B6D4"
                />
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Trend Comparison */}
        <FadeIn delay={0.25}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Compare Trends</h2>
            <TrendComparison />
          </section>
        </FadeIn>

        {/* Historical Data */}
        <FadeIn delay={0.3}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Historical Trend</h2>
            <div className="mb-4">
              <select
                className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedTrendId ?? ""}
                onChange={(e) => setSelectedTrendId(e.target.value ? Number(e.target.value) : null)}
                aria-label="Select a trend"
              >
                <option value="">Select a trend...</option>
                {trends.data?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedTrendId ? (
              history.loading ? (
                <Loading />
              ) : history.error ? (
                <ErrorState message={history.error} onRetry={history.refetch} />
              ) : !history.data?.length ? (
                <EmptyState message="No historical data for this trend" />
              ) : (
                <div className="space-y-4">
                  {selectedTrend && (
                    <GlassCard>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-white font-semibold text-sm">{selectedTrend.title}</p>
                          <p className="text-xs text-zinc-500 capitalize">{selectedTrend.category}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                          <TrendStats score={selectedTrend.score} growth={selectedTrend.growth} />
                          <HypeIndicator score={selectedTrend.score} size="md" />
                        </div>
                      </div>
                    </GlassCard>
                  )}
                  <GlassCard>
                    <GrowthChart
                      data={history.data.map((h: any) => ({
                        date: h.date,
                        score: h.score,
                        growth: h.growth,
                      }))}
                      showGrowth
                    />
                  </GlassCard>
                </div>
              )
            ) : (
              <GlassCard>
                <div className="py-8 text-center">
                  <p className="text-zinc-500 text-sm">
                    Select a trend above to view its historical data
                  </p>
                </div>
              </GlassCard>
            )}
          </section>
        </FadeIn>
      </div>
    </DashboardLayout>
  );
}
