import axios from "axios";
import type {
  TrendList,
  GameList,
  MusicList,
  MovieList,
  HypeScore,
  HistoryPoint,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
});

export async function fetchTrends(params?: {
  category?: string;
  source?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<TrendList> {
  const { data } = await api.get("/trends", { params });
  return data;
}

export async function fetchTopTrends(params?: {
  category?: string;
  limit?: number;
}) {
  const { data } = await api.get("/trends/top", { params });
  return data;
}

export async function fetchTrendCategories(): Promise<string[]> {
  const { data } = await api.get("/trends/categories");
  return data;
}

export async function fetchGames(params?: {
  genre?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<GameList> {
  const { data } = await api.get("/games", { params });
  return data;
}

export async function fetchTopGames(params?: { limit?: number }) {
  const { data } = await api.get("/games/top", { params });
  return data;
}

export async function fetchMusic(params?: {
  genre?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<MusicList> {
  const { data } = await api.get("/music", { params });
  return data;
}

export async function fetchTopMusic(params?: { limit?: number }) {
  const { data } = await api.get("/music/top", { params });
  return data;
}

export async function fetchTopArtists(params?: { limit?: number }) {
  const { data } = await api.get("/music/artists", { params });
  return data;
}

export async function fetchMovies(params?: {
  media_type?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<MovieList> {
  const { data } = await api.get("/movies", { params });
  return data;
}

export async function fetchTrendingMovies(params?: { limit?: number }) {
  const { data } = await api.get("/movies/trending", { params });
  return data;
}

export async function fetchHypeScores(params?: {
  limit?: number;
}): Promise<HypeScore[]> {
  const { data } = await api.get("/analytics/hype-score", { params });
  return data;
}

export async function fetchTopGrowing(params?: {
  limit?: number;
}): Promise<HypeScore[]> {
  const { data } = await api.get("/analytics/growth", { params });
  return data;
}

export async function fetchTrendHistory(
  trendId: number,
  params?: { limit?: number }
): Promise<HistoryPoint[]> {
  const { data } = await api.get(`/analytics/history/${trendId}`, { params });
  return data;
}
