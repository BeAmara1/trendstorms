# Trendpulse

Cultural trends analytics dashboard using Spotify, Steam, TMDB and Google Trends data.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, TailwindCSS, Recharts, Framer Motion
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL
- **Deploy:** Vercel (frontend), Render (backend)

## Architecture

```
External APIs
     ↓
Collectors (Python)
     ↓
PostgreSQL
     ↓
FastAPI
     ↓
Next.js Dashboard
     ↓
User Interface
```

## Roadmap

- [ ] Data collection from Spotify, Steam, TMDB, RAWG, Google Trends
- [ ] REST API with aggregations and analytics
- [ ] Real-time dashboard with interactive charts
- [ ] Trend comparison across platforms
- [ ] Time-series analysis and forecasting
- [ ] Automated data pipeline and scheduling

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
