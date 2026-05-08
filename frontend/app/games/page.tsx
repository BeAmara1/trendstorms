"use client";

import { DashboardLayout } from "@/components/layout";
import { GameCard } from "@/components/cards";
import { LoadingGrid } from "@/components/ui/Loading";
import { ErrorState, EmptyState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks";
import { fetchTopGames } from "@/services/api";

export default function GamesPage() {
  const { data, loading, error, refetch } = useAsync(() => fetchTopGames({ limit: 20 }), []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Games</h1>
          <p className="text-zinc-400 text-sm mt-1">Top games by player count and rating</p>
        </div>

        {loading ? (
          <LoadingGrid count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !data?.length ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((g: any) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
