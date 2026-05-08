"use client";

import { DashboardLayout } from "@/components/layout";
import { MusicCard } from "@/components/cards";
import { GenreDistributionChart } from "@/components/charts";
import GlassCard from "@/components/ui/GlassCard";
import HeroSection from "@/components/ui/HeroSection";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchTopMusic, fetchTopArtists } from "@/services/api";

export default function MusicPage() {
  const tracks = useAsync(() => fetchTopMusic({ limit: 12 }), []);
  const artists = useAsync(() => fetchTopArtists({ limit: 8 }), []);

  const genreData = (tracks.data || []).reduce((acc: Record<string, number>, m: any) => {
    const genre = m.genre || "Other";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreChart: { name: string; value: number }[] = Object.entries(genreData).map(
    ([name, value]) => ({ name, value: value as number })
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <HeroSection
          title="Music"
          subtitle="Top tracks and artists"
          metric={tracks.data?.[0] ? { label: "Top Popularity", value: tracks.data[0].popularity, decimals: 0 } : undefined}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Tracks</h2>
          </div>
          {tracks.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : tracks.error ? (
            <ErrorState message={tracks.error} onRetry={tracks.refetch} />
          ) : !tracks.data?.length ? (
            <EmptyState />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tracks.data.map((m: any) => (
                <StaggerItem key={m.id}>
                  <MusicCard item={m} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Artists</h2>
          </div>
          {artists.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : artists.error ? (
            <ErrorState message={artists.error} onRetry={artists.refetch} />
          ) : !artists.data?.length ? (
            <EmptyState />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {artists.data.map((a: any) => (
                <StaggerItem key={a.id}>
                  <MusicCard item={a} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
