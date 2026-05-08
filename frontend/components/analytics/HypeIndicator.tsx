"use client";

interface HypeIndicatorProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function HypeIndicator({ score, size = "md" }: HypeIndicatorProps) {
  const bars = 5;
  const filled = Math.round((score / 100) * bars);
  const sizeClass = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-3 h-3" : "w-2 h-2";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`${sizeClass} rounded-sm ${
            i < filled ? "bg-purple-500" : "bg-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}
