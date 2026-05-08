# Trendpulse

**Real-time cultural trends analytics dashboard** — tracking what's trending across music, gaming, movies, and the web.

[Live Dashboard](https://trendpulse.vercel.app) · [API Docs](https://trendpulse-api.onrender.com/docs) · [About](https://trendpulse.vercel.app/about)

---

## Overview

Trendpulse is a full-stack analytics platform that collects data from Spotify, Steam, TMDB, RAWG, and Google Trends, processes it through six analytics engines, and visualizes everything in a polished real-time dashboard.

**Automated pipeline** · 8 scheduled jobs · Rate-limited collectors · Cleanup & deduplication · Rotating logs

---

## Architecture

```
External APIs (Spotify, Steam, TMDB, RAWG, Google Trends)
        ↓
Collectors + APScheduler (8 automated jobs)
        ↓
PostgreSQL Database
        ↓
FastAPI + 6 Analytics Engines
        ↓
Next.js Dashboard (React 19 + Tailwind CSS)
```

---

## Analytics Engines

| Engine              | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| **Hype Score**      | Weighted score (0–100) from growth, social buzz, platform   |
| **Growth Analysis** | Classifies trends: Exploding, Rising, Stable, Declining, Crashing |
| **Momentum**        | Velocity + acceleration from last 5 snapshots               |
| **Trend Detection** | Explosive, viral, sustained, seasonal, falling patterns     |
| **Correlation**     | Cross-platform Pearson correlation                          |
| **Forecasting**     | Moving-average + linear projection up to 30 steps ahead     |

---

## Tech Stack

| Layer       | Technologies                                                |
| ----------- | ----------------------------------------------------------- |
| Frontend    | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Recharts |
| Backend     | Python 3.14, FastAPI, SQLAlchemy 2.0, APScheduler           |
| Database    | PostgreSQL + Alembic migrations                             |
| Deploy      | Vercel, Render, GitHub Actions CI/CD                        |
| APIs        | Spotify, Steam, TMDB, RAWG, Google Trends                   |

---

## Features

- **Dark-themed UI** with glassmorphism cards, glow effects, staggered animations
- **7 chart types** with custom glass tooltips and gradient fills
- **Responsive** — works on desktop, tablet, and mobile
- **8 automated jobs** — Steam (30min), Spotify (1h), TMDB (2h), RAWG (30min), Trends (4h), Analytics (1h), Snapshots (6h), Cleanup (24h)
- **Rate limiting** — 100 req/min per IP
- **Retry with backoff** — `@with_retry(max_retries=3, backoff=2.0)`
- **In-memory cache** — TTL + LRU eviction
- **Rotating logs** — 5 MB per component, 3 backups
- **CI/CD** — GitHub Actions runs tests + lint + build on every push

---

## Getting Started

### Prerequisites

- Python 3.14+
- Node.js 22+
- PostgreSQL (or SQLite for local dev)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Copy env vars
cp .env.example .env
# Edit .env with your API keys

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## API Endpoints

| Method | Path                           | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/`                            | API root                           |
| GET    | `/health`                      | Health check                       |
| GET    | `/system/status`               | Scheduler, DB, cache status        |
| GET    | `/trends`                      | List trends with filters           |
| GET    | `/analytics/hype-score`        | Top hype scores                    |
| GET    | `/analytics/growth`            | Top growing trends                 |
| GET    | `/analytics/exploding`         | Exploding trends                   |
| GET    | `/analytics/momentum`          | Momentum analysis                  |
| GET    | `/analytics/correlations`      | Cross-platform correlations        |
| GET    | `/analytics/insights`          | AI-powered insights                |
| GET    | `/analytics/forecast/{id}`     | Trend forecast                     |

Full API documentation at `/docs` (Swagger) or `/redoc` (ReDoc).

---

## Deployment

### Frontend (Vercel)

1. Push the `frontend/` directory to a GitHub repo
2. Import the repo on [Vercel](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy — every push to `main` auto-deploys

### Backend (Render)

1. Push the `backend/` directory to a GitHub repo
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. Add environment variables (DATABASE_URL, API keys, etc.)
6. Deploy

### Database (Neon)

1. Create a free PostgreSQL database on [Neon](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run `alembic upgrade head` to apply migrations

---

## Environment Variables

| Variable              | Required | Description                         |
| --------------------- | -------- | ----------------------------------- |
| `DATABASE_URL`        | Yes      | PostgreSQL connection string        |
| `SPOTIFY_CLIENT_ID`   | Yes      | Spotify API client ID               |
| `SPOTIFY_CLIENT_SECRET` | Yes    | Spotify API client secret           |
| `TMDB_API_KEY`        | Yes      | TMDB API key                        |
| `RAWG_API_KEY`        | Yes      | RAWG API key                        |
| `STEAM_API_KEY`       | Yes      | Steam API key                       |
| `ALLOWED_ORIGINS`     | No       | CORS origins (comma-separated)      |
| `SENTRY_DSN`          | No       | Sentry error tracking DSN           |

---

## License

MIT
