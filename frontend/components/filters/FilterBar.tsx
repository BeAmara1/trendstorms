"use client";

import { Filter } from "lucide-react";
import TimeFilter, { type TimePeriod } from "./TimeFilter";
import CategoryFilter from "./CategoryFilter";

interface FilterBarProps {
  time: TimePeriod;
  category: string;
  onTimeChange: (v: TimePeriod) => void;
  onCategoryChange: (v: string) => void;
}

export default function FilterBar({
  time,
  category,
  onTimeChange,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      <Filter className="w-4 h-4 text-zinc-400" />
      <TimeFilter value={time} onChange={onTimeChange} />
      <div className="w-px h-6 bg-zinc-800" />
      <CategoryFilter value={category} onChange={onCategoryChange} />
    </div>
  );
}
