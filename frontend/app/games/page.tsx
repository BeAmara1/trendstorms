"use client";

import { DashboardLayout } from "@/components/layout";
import { GameCard } from "@/components/cards";
import { GenreDistributionChart } from "@/components/charts";
import GlassCard from "@/components/ui/GlassCard";
import HeroSection from "@/components/ui/HeroSection";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { SkeletonCard, SkeletonChart } from "@/components/ui/Skeleton";
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
        <HeroSection
          title="Games"
          subtitle="Top games by player count and rating"
          metric={data?.[0] ? { label: "Top Players", value: data[0].steam_players, decimals: 0 } : undefined}
        />

        {genreChart.length > 0 && (
          <FadeIn delay={0.1}>
            <GlassCard>
              <h2 className="text-white text-sm font-semibold mb-4">Genre Distribution</h2>
              <GenreDistributionChart data={genreChart} />
            </GlassCard>
          </FadeIn>
        )}

        <section>
          <h2 className="text-white text-lg font-semibold mb-4">All Games</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
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
