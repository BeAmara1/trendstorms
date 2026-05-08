"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { BarChart, LineChart, AreaChart } from "@/components/charts";
import { Loading } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchHypeScores, fetchTopGrowing, fetchTrendHistory, fetchTopTrends } from "@/services/api";

export default function AnalyticsPage() {
  const [selectedTrendId, setSelectedTrendId] = useState<number | null>(null);

  const hype = useAsync(() => fetchHypeScores({ limit: 10 }), []);
  const growth = useAsync(() => fetchTopGrowing({ limit: 10 }), []);
  const trends = useAsync(() => fetchTopTrends({ limit: 20 }), []);
  const history = useAsync(
    () => (selectedTrendId ? fetchTrendHistory(selectedTrendId) : Promise.resolve([])),
    [selectedTrendId]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Hype scores, growth trends, and historical data</p>
        </div>

        {/* Hype Scores */}
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
              <BarChart
                data={hype.data.map((h: any) => ({ name: h.title, value: h.hype_score }))}
                color="#a855f7"
              />
            </div>
          )}
        </section>

        {/* Growth */}
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
              <AreaChart
                data={growth.data.map((g: any) => ({ name: g.title, value: g.growth_rate }))}
                color="#22d3ee"
              />
            </div>
          )}
        </section>

        {/* Historical Data */}
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
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <LineChart
                  data={history.data.map((h: any) => ({ date: h.date, score: h.score }))}
                  color="#a855f7"
                />
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
      </div>
    </DashboardLayout>
  );
}
