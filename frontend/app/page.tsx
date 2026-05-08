"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout";
import { TrendCard, GameCard, MovieCard, MusicCard } from "@/components/cards";
import { RankingChart } from "@/components/charts";
import { FilterBar } from "@/components/filters";
import { MomentumCard } from "@/components/analytics";
import SearchBar from "@/components/ui/SearchBar";
import HeroSection from "@/components/ui/HeroSection";
import GlassCard from "@/components/ui/GlassCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { SkeletonCard, SkeletonHero, SkeletonChart } from "@/components/ui/Skeleton";
import { Loading } from "@/components/ui/Loading";
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

  const topGrown = growth.data?.[0];
  const topTrend = trends.data?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Hero Section */}
        <HeroSection
          title={topTrend?.title || "Cultural Trends"}
          subtitle={
            topTrend
              ? `Real-time analytics from Spotify, Steam, TMDB and Google Trends`
              : "Real-time analytics from Spotify, Steam, TMDB and Google Trends"
          }
          badge={topGrown && topGrown.growth_rate > 50 ? { variant: "exploding", label: "Exploding" } : undefined}
          growth={topGrown?.growth_rate}
          metric={topTrend ? { label: "Top Score", value: topTrend.score, decimals: 0, suffix: " pts" } : undefined}
        />

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
            <Link href="/analytics" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              View all
            </Link>
          </div>
          {trends.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
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
              <SkeletonChart />
            ) : growth.error ? (
              <ErrorState message={growth.error} onRetry={growth.refetch} />
            ) : !growth.data?.length ? (
              <EmptyState />
            ) : (
              <GlassCard>
                <RankingChart
                  data={growth.data.map((g: any, i: number) => ({
                    rank: i + 1,
                    name: g.title,
                    value: g.growth_rate,
                  }))}
                  color="#06B6D4"
                />
              </GlassCard>
            )}
          </section>
        </FadeIn>

        {/* Top Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Top Games</h2>
            <Link href="/games" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              View all
            </Link>
          </div>
          {games.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Trending Movies</h2>
              <Link href="/movies" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all
              </Link>
            </div>
            {movies.loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
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
              <Link href="/music" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all
              </Link>
            </div>
            {music.loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
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
