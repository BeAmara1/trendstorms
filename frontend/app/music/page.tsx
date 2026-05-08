"use client";

import { DashboardLayout } from "@/components/layout";
import { MusicCard } from "@/components/cards";
import { GenreDistributionChart } from "@/components/charts";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { LoadingGrid } from "@/components/ui/Loading";
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
      <div className="space-y-8">
        <FadeIn>
          <div>
            <h1 className="text-2xl font-bold text-white">Music</h1>
            <p className="text-zinc-400 text-sm mt-1">Top tracks and artists</p>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Tracks</h2>
          </div>
          {tracks.loading ? (
            <LoadingGrid count={6} />
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
            <LoadingGrid count={4} />
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
