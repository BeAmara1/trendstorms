interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-zinc-800 p-4">
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-zinc-800/50 p-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6 ml-auto" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="glass-card p-8 space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
