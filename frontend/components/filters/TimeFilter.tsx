"use client";

export type TimePeriod = "24h" | "7d" | "30d" | "all";

const periods: { value: TimePeriod; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

interface TimeFilterProps {
  value: TimePeriod;
  onChange: (v: TimePeriod) => void;
}

export default function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === p.value
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
