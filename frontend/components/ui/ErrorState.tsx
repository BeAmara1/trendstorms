import { AlertCircle, RefreshCw, Database, SearchX } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  variant?: "error" | "empty" | "offline";
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
  variant = "error",
}: ErrorStateProps) {
  const icons = {
    error: AlertCircle,
    empty: SearchX,
    offline: Database,
  };
  const Icon = icons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="alert">
      <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-zinc-400" />
      </div>
      <p className="text-zinc-400 text-sm mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-purple-500"
          aria-label="Retry loading"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  message = "No data available",
  icon,
}: {
  message?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="status">
      {icon || (
        <div className="w-12 h-12 rounded-xl bg-zinc-800/30 flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6 text-zinc-600" />
        </div>
      )}
      <p className="text-zinc-500 text-sm">{message}</p>
    </div>
  );
}
