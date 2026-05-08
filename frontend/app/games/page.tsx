"use client";

import { DashboardLayout } from "@/components/layout";
import { GameCard } from "@/components/cards";
import { GenreDistributionChart } from "@/components/charts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { LoadingGrid } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchTopGames } from "@/services/api";

export default function GamesPage() {
  const { data, loading, error, refetch } = useAsync(() => fetchTopGames({ limit: 20 }), []);

  const genreData = (data || []).reduce((acc: Record<string, number>, g: any) => {
    const genre = g.genre || "Other";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreChart: { name: string; value: number }[] = Object.entries(genreData).map(
    ([name, value]) => ({ name, value: value as number })
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FadeIn>
          <div>
            <h1 className="text-2xl font-bold text-white">Games</h1>
            <p className="text-zinc-400 text-sm mt-1">Top games by player count and rating</p>
          </div>
        </FadeIn>

        {genreChart.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
              <h2 className="text-white text-sm font-semibold mb-4">Genre Distribution</h2>
              <GenreDistributionChart data={genreChart} />
            </div>
          </FadeIn>
        )}

        <section>
          <h2 className="text-white text-lg font-semibold mb-4">All Games</h2>
          {loading ? (
            <LoadingGrid count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data?.length ? (
            <EmptyState />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((g: any) => (
                <StaggerItem key={g.id}>
                  <GameCard game={g} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
