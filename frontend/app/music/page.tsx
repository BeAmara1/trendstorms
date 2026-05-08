"use client";

import { DashboardLayout } from "@/components/layout";
import { MusicCard } from "@/components/cards";
import { LoadingGrid } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchTopMusic, fetchTopArtists } from "@/services/api";

export default function MusicPage() {
  const tracks = useAsync(() => fetchTopMusic({ limit: 12 }), []);
  const artists = useAsync(() => fetchTopArtists({ limit: 8 }), []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Music</h1>
          <p className="text-zinc-400 text-sm mt-1">Top tracks and artists</p>
        </div>

        <section>
          <h2 className="text-white text-lg font-semibold mb-4">Top Tracks</h2>
          {tracks.loading ? (
            <LoadingGrid count={6} />
          ) : tracks.error ? (
            <ErrorState message={tracks.error} onRetry={tracks.refetch} />
          ) : !tracks.data?.length ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tracks.data.map((m: any) => (
                <MusicCard key={m.id} item={m} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-4">Top Artists</h2>
          {artists.loading ? (
            <LoadingGrid count={4} />
          ) : artists.error ? (
            <ErrorState message={artists.error} onRetry={artists.refetch} />
          ) : !artists.data?.length ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {artists.data.map((a: any) => (
                <MusicCard key={a.id} item={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
