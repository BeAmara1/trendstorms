"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { MovieCard } from "@/components/cards";
import { LoadingGrid } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";

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
        <div>
          <h1 className="text-2xl font-bold text-white">Movies & TV</h1>
          <p className="text-zinc-400 text-sm mt-1">Trending movies and TV shows</p>
        </div>

        <div className="flex gap-2">
          {(["trending", "movies", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingGrid count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data?.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((m: any) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
