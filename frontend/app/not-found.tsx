import Link from "next/link";
import { Home, TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="relative mb-8">
        <TrendingUp className="w-16 h-16 text-purple-500/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-white/10">404</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
      <p className="text-zinc-400 text-sm mb-8 text-center max-w-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-200"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
