"use client";

const variants: Record<string, { bg: string; text: string; dot: string }> = {
  exploding: { bg: "bg-green-500/10 border-green-500/30", text: "text-green-400", dot: "bg-green-400" },
  rising: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  viral: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  explosive: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  sustained: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400" },
  stable: { bg: "bg-zinc-500/10 border-zinc-500/30", text: "text-zinc-400", dot: "bg-zinc-400" },
  declining: { bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-400", dot: "bg-orange-400" },
  falling: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", dot: "bg-red-400" },
  crashing: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", dot: "bg-red-400" },
  new: { bg: "bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  accelerating: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  high: { bg: "bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  decelerating: { bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-400" },
  low: { bg: "bg-zinc-500/10 border-zinc-500/30", text: "text-zinc-400", dot: "bg-zinc-400" },
};

interface BadgeProps {
  variant: string;
  children?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export default function Badge({ variant, children, className = "", dot = true }: BadgeProps) {
  const v = variants[variant] || variants.stable;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${v.bg} ${v.text} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />}
      {children || variant}
    </span>
  );
}

export function BadgeGroup({ items }: { items: { variant: string; label: string }[] }) {
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {items.map((item, i) => (
        <Badge key={i} variant={item.variant}>
          {item.label}
        </Badge>
      ))}
    </span>
  );
}
