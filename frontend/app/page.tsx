"use client";

import { DashboardLayout } from "@/components/layout";
import { TrendCard, GameCard, MovieCard, MusicCard } from "@/components/cards";
import { BarChart } from "@/components/charts";
import { LoadingGrid, Loading } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import {
  fetchTopTrends,
  fetchTopGames,
  fetchTrendingMovies,
  fetchTopMusic,
  fetchTopGrowing,
} from "@/services/api";

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
  );
}

export default function Home() {
  const trends = useAsync(() => fetchTopTrends({ limit: 6 }), []);
  const games = useAsync(() => fetchTopGames({ limit: 4 }), []);
  const movies = useAsync(() => fetchTrendingMovies({ limit: 4 }), []);
  const music = useAsync(() => fetchTopMusic({ limit: 4 }), []);
  const growth = useAsync(() => fetchTopGrowing({ limit: 6 }), []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div>
          <h1 className="text-2xl font-bold text-white">Cultural Trends</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time analytics from Spotify, Steam, TMDB and Google Trends
          </p>
        </div>

        {/* Top Trends */}
        <section>
          <SectionHeader title="Top Trends" />
          {trends.loading ? (
            <LoadingGrid count={6} />
          ) : trends.error ? (
            <ErrorState message={trends.error} onRetry={trends.refetch} />
          ) : !trends.data?.length ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trends.data.map((t: any) => (
                <TrendCard key={t.id} trend={t} />
              ))}
            </div>
          )}
        </section>

        {/* Growth Rankings */}
        <section>
          <SectionHeader title="Highest Growth" />
          {growth.loading ? (
            <Loading />
          ) : growth.error ? (
            <ErrorState message={growth.error} onRetry={growth.refetch} />
          ) : !growth.data?.length ? (
            <EmptyState />
          ) : (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
              <BarChart
                data={growth.data.map((g: any) => ({
                  name: g.title,
                  value: g.growth_rate,
                }))}
                color="#22d3ee"
              />
            </div>
          )}
        </section>

        {/* Top Games */}
        <section>
          <SectionHeader title="Top Games" />
          {games.loading ? (
            <LoadingGrid count={4} />
          ) : games.error ? (
            <ErrorState message={games.error} onRetry={games.refetch} />
          ) : !games.data?.length ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {games.data.map((g: any) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Movies & Music */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <SectionHeader title="Trending Movies" />
            {movies.loading ? (
              <LoadingGrid count={2} />
            ) : movies.error ? (
              <ErrorState message={movies.error} onRetry={movies.refetch} />
            ) : !movies.data?.length ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movies.data.map((m: any) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            )}
          </section>
          <section>
            <SectionHeader title="Trending Music" />
            {music.loading ? (
              <LoadingGrid count={2} />
            ) : music.error ? (
              <ErrorState message={music.error} onRetry={music.refetch} />
            ) : !music.data?.length ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {music.data.map((m: any) => (
                  <MusicCard key={m.id} item={m} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
