"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { MovieCard } from "@/components/cards";
import HeroSection from "@/components/ui/HeroSection";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animated";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";

const tabs = ["trending", "movies", "tv"] as const;

export default function MoviesPage() {
  const [tab, setTab] = useState<"trending" | "movies" | "tv">("trending");

  const fetcher = () => {
    if (tab === "trending") return fetchTrendingMovies({ limit: 20 });
    return fetchMovies({ media_type: tab === "tv" ? "tv" : "movie", limit: 20 });
  };

  const { data, loading, error, refetch } = useAsync(fetcher, [tab]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <HeroSection
          title="Movies & TV"
          subtitle="Trending movies and TV shows"
          metric={data?.[0] ? { label: "Top Rating", value: data[0].rating, decimals: 1 } : undefined}
        />

        <FadeIn delay={0.05}>
          <div className="flex gap-2" role="tablist" aria-label="Content type">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  tab === t
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </FadeIn>

        <section>
          <h2 className="text-white text-lg font-semibold mb-4 capitalize">{tab} Highlights</h2>
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
              {data.map((m: any) => (
                <StaggerItem key={m.id}>
                  <MovieCard movie={m} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
