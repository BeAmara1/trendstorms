"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout";
import { TrendCard, GameCard, MovieCard, MusicCard } from "@/components/cards";
import { RankingChart } from "@/components/charts";
import { FilterBar } from "@/components/filters";
import { MomentumCard } from "@/components/analytics";
import SearchBar from "@/components/ui/SearchBar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
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
import type { TimePeriod } from "@/components/filters";

export default function Home() {
  const [category, setCategory] = useState("");
  const [time, setTime] = useState<TimePeriod>("all");

  const trends = useAsync(() => fetchTopTrends({ category: category || undefined, limit: 6 }), [category]);
  const games = useAsync(() => fetchTopGames({ limit: 4 }), []);
  const movies = useAsync(() => fetchTrendingMovies({ limit: 4 }), []);
  const music = useAsync(() => fetchTopMusic({ limit: 4 }), []);
  const growth = useAsync(() => fetchTopGrowing({ limit: 8 }), []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Cultural Trends</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Real-time analytics from Spotify, Steam, TMDB and Google Trends
              </p>
            </div>
            <SearchBar />
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

        {/* Growth Momentum */}
        {growth.data && growth.data.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {growth.data.slice(0, 4).map((g: any, i: number) => (
                <MomentumCard
                  key={i}
                  title={g.title}
                  growth={g.growth_rate}
                  score={g.hype_score}
                  subtitle={g.category}
                />
              ))}
            </div>
          </FadeIn>
        )}

        {/* Top Trends */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Trends</h2>
            <Link href="/analytics" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          {trends.loading ? (
            <LoadingGrid count={6} />
          ) : trends.error ? (
            <ErrorState message={trends.error} onRetry={trends.refetch} />
          ) : !trends.data?.length ? (
            <EmptyState />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trends.data.map((t: any) => (
                <StaggerItem key={t.id}>
                  <Link href={`/trend/${t.id}`}>
                    <TrendCard trend={t} />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* Growth Rankings */}
        <FadeIn delay={0.2}>
          <section>
            <h2 className="text-white text-lg font-semibold mb-4">Highest Growth</h2>
            {growth.loading ? (
              <Loading />
            ) : growth.error ? (
              <ErrorState message={growth.error} onRetry={growth.refetch} />
            ) : !growth.data?.length ? (
              <EmptyState />
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                <RankingChart
                  data={growth.data.map((g: any, i: number) => ({
                    rank: i + 1,
                    name: g.title,
                    value: g.growth_rate,
                  }))}
                  color="#22d3ee"
                />
              </div>
            )}
          </section>
        </FadeIn>

        {/* Top Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Games</h2>
            <Link href="/games" className="text-xs text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>
          {games.loading ? (
            <LoadingGrid count={4} />
          ) : games.error ? (
            <ErrorState message={games.error} onRetry={games.refetch} />
          ) : !games.data?.length ? (
            <EmptyState />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {games.data.map((g: any) => (
                <StaggerItem key={g.id}>
                  <GameCard game={g} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>

        {/* Trending Movies & Music */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Trending Movies</h2>
              <Link href="/movies" className="text-xs text-purple-400 hover:text-purple-300">
                View all
              </Link>
            </div>
            {movies.loading ? (
              <LoadingGrid count={2} />
            ) : movies.error ? (
              <ErrorState message={movies.error} onRetry={movies.refetch} />
            ) : !movies.data?.length ? (
              <EmptyState />
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movies.data.map((m: any) => (
                  <StaggerItem key={m.id}>
                    <MovieCard movie={m} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Trending Music</h2>
              <Link href="/music" className="text-xs text-purple-400 hover:text-purple-300">
                View all
              </Link>
            </div>
            {music.loading ? (
              <LoadingGrid count={2} />
            ) : music.error ? (
              <ErrorState message={music.error} onRetry={music.refetch} />
            ) : !music.data?.length ? (
              <EmptyState />
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {music.data.map((m: any) => (
                  <StaggerItem key={m.id}>
                    <MusicCard item={m} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
