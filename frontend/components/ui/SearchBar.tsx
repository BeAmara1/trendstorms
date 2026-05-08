"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAsync } from "@/hooks";
import { fetchTopTrends } from "@/services/api";

interface SearchBarProps {
  onSelect?: (title: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSelect,
  placeholder = "Search trends...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useAsync(
    () =>
      query.length >= 2
        ? fetchTopTrends({ limit: 10 })
        : Promise.resolve([]),
    [query]
  );

  const filtered = (data || []).filter((t: any) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-8 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-zinc-500 hover:text-white" />
          </button>
        )}
      </div>
      {open && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-zinc-500">No results</div>
          ) : (
            filtered.slice(0, 8).map((t: any) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelect?.(t.title);
                  setQuery(t.title);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center justify-between"
              >
                <span>{t.title}</span>
                <span className="text-xs text-zinc-500 capitalize">{t.category}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
