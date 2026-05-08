export interface Trend {
  id: number
  title: string
  category: string
  source: string
  score: number
  growth: number
  extra_data?: string
  created_at: string
}

export interface TrendList {
  items: Trend[]
  total: number
  page: number
  limit: number
}

export interface Game {
  id: number
  title: string
  genre?: string
  steam_players: number
  rating: number
  release_date?: string
  image_url?: string
  source_id?: string
  created_at: string
}

export interface GameList {
  items: Game[]
  total: number
  page: number
  limit: number
}

export interface Music {
  id: number
  track_name: string
  artist_name: string
  genre?: string
  popularity: number
  spotify_id?: string
  image_url?: string
  created_at: string
}

export interface MusicList {
  items: Music[]
  total: number
  page: number
  limit: number
}

export interface Movie {
  id: number
  title: string
  media_type: string
  rating: number
  popularity: number
  release_date?: string
  poster_url?: string
  source_id?: string
  created_at: string
}

export interface MovieList {
  items: Movie[]
  total: number
  page: number
  limit: number
}

export interface HypeScore {
  title: string
  category: string
  hype_score: number
  growth_rate: number
}

export interface HistoryPoint {
  date: string
  score: number
  growth: number
}
