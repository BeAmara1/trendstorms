import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="h-3 bg-zinc-800 rounded w-1/2" />
      <div className="h-8 bg-zinc-800 rounded w-1/4" />
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
