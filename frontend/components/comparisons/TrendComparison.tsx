"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import TrendComparisonChart from "../charts/TrendComparisonChart";
import { useAsync } from "@/hooks";
import { fetchTopTrends } from "@/services/api";

export default function TrendComparison() {
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdown, setDropdown] = useState(false);

  const { data: trends } = useAsync(() => fetchTopTrends({ limit: 30 }), []);

  const addTrend = (title: string) => {
    if (!selected.includes(title) && selected.length < 5) {
      setSelected([...selected, title]);
    }
    setDropdown(false);
  };

  const removeTrend = (title: string) => {
    setSelected(selected.filter((s) => s !== title));
  };

  const mockData = Array.from({ length: 20 }).map((_, i) => ({
    date: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    ...Object.fromEntries(
      selected.map((s) => [s, 50 + Math.sin(i / 3 + selected.indexOf(s)) * 30 + Math.random() * 20])
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
          >
            {s}
            <button onClick={() => removeTrend(s)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {selected.length < 5 && (
          <div className="relative">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-full transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Trend
            </button>
            {dropdown && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {(trends || [])
                  .filter((t: any) => !selected.includes(t.title))
                  .slice(0, 15)
                  .map((t: any) => (
                    <button
                      key={t.id}
                      onClick={() => addTrend(t.title)}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {t.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selected.length >= 2 ? (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <TrendComparisonChart data={mockData} trends={selected} />
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
          <p className="text-zinc-500 text-sm">
            Select at least 2 trends to compare
          </p>
        </div>
      )}
    </div>
  );
}
