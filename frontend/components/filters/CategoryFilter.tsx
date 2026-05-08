"use client";

import { X } from "lucide-react";

const categories = [
  { value: "", label: "All" },
  { value: "music", label: "Music" },
  { value: "game", label: "Games" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV" },
  { value: "artist", label: "Artists" },
];

interface CategoryFilterProps {
  value: string;
  onChange: (v: string) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            value === c.value
              ? "bg-purple-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          {c.label}
        </button>
      ))}
      {value && (
        <button
          onClick={() => onChange("")}
          className="px-2 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
