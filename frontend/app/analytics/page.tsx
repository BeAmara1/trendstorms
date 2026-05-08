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
import { TrendStats, HypeIndicator } from "@/components/analytics";
import { FadeIn } from "@/components/ui/Animated";
import { Loading } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import {
  fetchHypeScores,
  fetchTopGrowing,
  fetchTrendHistory,
  fetchTopTrends,
} from "@/services/api";
import type { TimePeriod } from "@/components/filters";

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
      <div className="space-y-8">
        <FadeIn>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-zinc-400 text-sm mt-1">Hype scores, growth trends, and historical data</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <FilterBar
            time={time}
            category={category}
            onTimeChange={setTime}
            onCategoryChange={setCategory}
          />
        </FadeIn>

        {/* Hype Score Rankings */}
        <FadeIn delay={0.1}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Hype Score Rankings</h2>
            {hype.loading ? (
              <Loading />
            ) : hype.error ? (
              <ErrorState message={hype.error} onRetry={hype.refetch} />
            ) : !hype.data?.length ? (
              <EmptyState />
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <RankingChart
                  data={hype.data.map((h: any, i: number) => ({
                    rank: i + 1,
                    name: h.title,
                    value: h.hype_score,
                  }))}
                  color="#a855f7"
                />
              </div>
            )}
          </section>
        </FadeIn>

        {/* Genre Distribution */}
        {genreChart.length > 0 && (
          <FadeIn delay={0.15}>
            <section>
              <h2 className="text-white text-lg font-semibold mb-4">Category Distribution</h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <GenreDistributionChart data={genreChart} />
              </div>
            </section>
          </FadeIn>
        )}

        {/* Growth Rates */}
        <FadeIn delay={0.2}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Growth Rates</h2>
            {growth.loading ? (
              <Loading />
            ) : growth.error ? (
              <ErrorState message={growth.error} onRetry={growth.refetch} />
            ) : !growth.data?.length ? (
              <EmptyState />
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <PopularityTimeline
                  data={growth.data.map((g: any, i: number) => ({
                    date: `#${i + 1} ${g.title}`,
                    value: g.growth_rate,
                  }))}
                  color="#22d3ee"
                />
              </div>
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
                className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 text-sm w-full max-w-xs"
                value={selectedTrendId ?? ""}
                onChange={(e) => setSelectedTrendId(e.target.value ? Number(e.target.value) : null)}
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
                    <div className="flex items-center gap-4 bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{selectedTrend.title}</p>
                        <p className="text-xs text-zinc-500 capitalize">{selectedTrend.category}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <TrendStats score={selectedTrend.score} growth={selectedTrend.growth} />
                        <HypeIndicator score={selectedTrend.score} size="md" />
                      </div>
                    </div>
                  )}
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <GrowthChart
                      data={history.data.map((h: any) => ({
                        date: h.date,
                        score: h.score,
                        growth: h.growth,
                      }))}
                      showGrowth
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
                <p className="text-zinc-500 text-sm">
                  Select a trend above to view its historical data
                </p>
              </div>
            )}
          </section>
        </FadeIn>
      </div>
    </DashboardLayout>
  );
}
