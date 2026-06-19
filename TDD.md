# UniAnalysis — Technical Design Document (TDD)

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client)               │
│  Next.js App Router (React 18 + Server Components)│
│  Pages: / (Dashboard), /platforms, /settings      │
└────────────────────┬────────────────────────────┘
                     │ HTTP (fetch)
                     ▼
┌─────────────────────────────────────────────────┐
│              Next.js API Routes                  │
│  /api/news, /api/universities, /api/platforms    │
│  /api/scrape (trigger), /api/search              │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────────┐  ┌─────────────────────┐
│  SQLite (better- │  │  Scraper Engine      │
│  sqlite3)        │  │  axios + cheerio     │
│  FTS5 search     │  │  SOCKS5 proxy        │
│  ./data/uni.db   │  │  (Windscribe)        │
└──────────────────┘  └─────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.x |
| Runtime | Node.js | ≥ 18 LTS |
| Language | JavaScript (ES2022) | - |
| Database | SQLite via `better-sqlite3` | latest |
| Full-text search | SQLite FTS5 | built-in |
| HTTP Client | `axios` | latest |
| HTML Parser | `cheerio` | latest |
| SOCKS5 Proxy | `socks-proxy-agent` | latest |
| Scheduling | `node-cron` | latest |
| Styling | Vanilla CSS + CSS Variables | - |
| Font | Inter (Google Fonts) | - |
| Icons | Lucide React | latest |

---

## 3. Project Structure

```
UniAnalysis/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout (sidebar + header)
│   │   ├── page.js             # Dashboard (news feed)
│   │   ├── platforms/
│   │   │   └── page.js         # Prep platforms page
│   │   ├── settings/
│   │   │   └── page.js         # University management
│   │   └── globals.css         # Global styles + design tokens
│   │
│   ├── components/
│   │   ├── Sidebar.js          # University list sidebar
│   │   ├── NewsCard.js         # Individual news card
│   │   ├── SearchBar.js        # Search input component
│   │   ├── FilterBar.js        # Category filter pills
│   │   ├── PlatformCard.js     # Prep platform card
│   │   ├── AddUniversityModal.js
│   │   ├── SkeletonCard.js     # Loading skeleton
│   │   └── EmptyState.js       # No results view
│   │
│   ├── lib/
│   │   ├── db.js               # SQLite connection + helpers
│   │   ├── schema.js           # Table creation + migrations
│   │   ├── seed.js             # University seed data
│   │   ├── scraper/
│   │   │   ├── index.js        # Scraper orchestrator
│   │   │   ├── proxy.js        # SOCKS5 proxy agent setup
│   │   │   ├── fetcher.js      # HTTP fetch with retry + UA rotation
│   │   │   ├── parser.js       # HTML parsing + data extraction
│   │   │   ├── classifier.js   # Category classification (keyword-based)
│   │   │   └── platforms.js    # Prep platform scraper
│   │   └── cron.js             # Background scrape scheduler
│   │
│   └── api/                    # Alias — actual routes in app/api/
│       (routes defined in app/api/)
│
├── app/
│   └── api/
│       ├── news/
│       │   └── route.js        # GET /api/news?search=&category=&uni=
│       ├── universities/
│       │   └── route.js        # GET, POST /api/universities
│       ├── platforms/
│       │   └── route.js        # GET /api/platforms
│       ├── scrape/
│       │   └── route.js        # POST /api/scrape (trigger)
│       └── search/
│           └── route.js        # GET /api/search?q=
│
├── data/                       # SQLite DB file (gitignored)
│   └── unianalysis.db
├── public/
│   └── logos/                  # University logo images (fallbacks)
├── .env.local                  # Proxy creds + config
├── .gitignore
├── package.json
├── next.config.js
├── PRD.md
├── TDD.md
├── agents.md
└── memory.md
```

---

## 4. Database Schema

### 4.1 `universities` Table

```sql
CREATE TABLE IF NOT EXISTS universities (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  abbreviation  TEXT NOT NULL,
  website_url   TEXT,
  admissions_url TEXT,
  logo_url      TEXT,
  scrape_url    TEXT,         -- specific page to scrape
  is_active     INTEGER DEFAULT 1,
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);
```

### 4.2 `news` Table

```sql
CREATE TABLE IF NOT EXISTS news (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  university_id   INTEGER NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  source_url      TEXT NOT NULL,
  category        TEXT DEFAULT 'general',
  published_at    TEXT,
  scraped_at      TEXT DEFAULT (datetime('now')),
  content_hash    TEXT UNIQUE,   -- SHA256(title + source_url)
  FOREIGN KEY (university_id) REFERENCES universities(id)
);
```

### 4.3 `news_fts` Virtual Table (FTS5)

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS news_fts USING fts5(
  title,
  description,
  content='news',
  content_rowid='id'
);
```

### 4.4 `platforms` Table

```sql
CREATE TABLE IF NOT EXISTS platforms (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  website_url   TEXT NOT NULL,
  logo_url      TEXT,
  tagline       TEXT,
  courses       TEXT,         -- JSON array of course names
  pricing       TEXT,         -- JSON object or description
  last_scraped  TEXT,
  created_at    TEXT DEFAULT (datetime('now'))
);
```

### 4.5 `scrape_logs` Table

```sql
CREATE TABLE IF NOT EXISTS scrape_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  university_id INTEGER,
  platform_id   INTEGER,
  status        TEXT NOT NULL,  -- 'success', 'error', 'skipped'
  items_found   INTEGER DEFAULT 0,
  error_message TEXT,
  started_at    TEXT DEFAULT (datetime('now')),
  finished_at   TEXT
);
```

---

## 5. API Design

### 5.1 News API

```
GET /api/news
  Query params:
    ?search=string        # full-text search
    &category=string      # filter by category
    &university_id=int    # filter by university
    &page=int             # pagination (default: 1)
    &limit=int            # items per page (default: 20)
    &sort=string          # 'newest' | 'oldest' | 'alpha'
  Response: { news: [...], total: int, page: int }
```

### 5.2 Universities API

```
GET /api/universities
  Response: { universities: [...] }

POST /api/universities
  Body: { name, abbreviation, website_url, logo_url, scrape_url }
  Response: { university: {...}, id: int }

DELETE /api/universities/[id]
  Response: { success: true }
```

### 5.3 Platforms API

```
GET /api/platforms
  Query params: ?search=string
  Response: { platforms: [...] }
```

### 5.4 Scrape API

```
POST /api/scrape
  Body: { type: 'all' | 'universities' | 'platforms', university_id?: int }
  Response: { status: 'started', job_id: string }
```

---

## 6. Scraper Architecture

### 6.1 Proxy Setup (`lib/scraper/proxy.js`)

```javascript
// Uses socks-proxy-agent to create an agent for axios
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = new SocksProxyAgent(
  `socks5://${user}:${pass}@proxy.windscribe.com:1080`
);
```

### 6.2 Fetcher (`lib/scraper/fetcher.js`)

- Accepts a URL, returns HTML string
- Uses the SOCKS5 agent
- Rotates User-Agent on each request
- Implements exponential backoff retry (3 attempts)
- Respects rate limit: 2s delay between same-domain requests

### 6.3 Parser (`lib/scraper/parser.js`)

- Receives HTML, returns structured array of news items
- Uses `cheerio` to find announcement/news sections
- Extracts: title, href, description, date
- Resolves relative URLs to absolute

### 6.4 Classifier (`lib/scraper/classifier.js`)

```javascript
const KEYWORDS = {
  test_updates: ['test date', 'exam schedule', 'pattern change', 'syllabus', 'NET', 'postponed', 'delayed'],
  admissions: ['admission', 'apply now', 'last date', 'eligibility', 'merit list'],
  scholarships: ['scholarship', 'financial aid', 'fee waiver', 'grant'],
  results: ['result', 'merit list', 'selected candidates', 'announcement'],
  fee_changes: ['fee structure', 'tuition fee', 'fee increase', 'challan'],
};
// Falls back to 'general' if no keywords match
```

### 6.5 Orchestrator (`lib/scraper/index.js`)

1. Fetch all active universities from DB
2. For each university (max 2 concurrent):
   a. Fetch HTML via fetcher
   b. Parse with parser
   c. Classify each item
   d. Deduplicate via content_hash
   e. Insert new items into DB
   f. Log result to scrape_logs
3. Return summary

---

## 7. Frontend Design System

### 7.1 CSS Variables (Design Tokens)

```css
:root {
  /* Colours */
  --bg-primary: #0a0a1a;
  --bg-secondary: #12122a;
  --bg-card: rgba(255, 255, 255, 0.04);
  --bg-card-hover: rgba(255, 255, 255, 0.08);
  --text-primary: #e8e8f0;
  --text-secondary: #8888aa;
  --accent-blue: #4f7cff;
  --accent-purple: #8b5cf6;
  --accent-gradient: linear-gradient(135deg, #4f7cff, #8b5cf6);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### 7.2 Component Styling Approach

- Each component has a co-located `.module.css` file
- Glassmorphism: `backdrop-filter: blur(12px); background: var(--glass-bg); border: 1px solid var(--glass-border);`
- Cards: fade-in animation on mount, scale + glow on hover
- Sidebar: fixed left, scrollable, active item highlighted with accent gradient

---

## 8. Development Phases

### Phase 1: Foundation (Testable: App boots, DB created, seed data visible)
- Initialize Next.js project
- Set up SQLite with better-sqlite3
- Create schema + seed universities
- Build basic layout (sidebar + body shell)
- API route: GET /api/universities

### Phase 2: UI Core (Testable: Full UI with mock data)
- Build all React components (Sidebar, NewsCard, SearchBar, FilterBar, etc.)
- Style with design system (dark theme, glassmorphism, animations)
- Wire up search + filter state management
- API routes: GET /api/news (returns mock/seed data initially)

### Phase 3: Scraper Engine (Testable: Scraper runs and populates DB)
- Implement proxy.js with Windscribe SOCKS5
- Build fetcher.js with retry + UA rotation
- Build parser.js for HTML extraction
- Build classifier.js for categorization
- Wire orchestrator to run on API trigger
- API route: POST /api/scrape

### Phase 4: Integration (Testable: Live scraped data in UI)
- Connect scraper output to news feed
- Implement FTS5 search
- Wire sidebar university filter to API
- Add manual refresh button
- Add scrape status/progress indicator

### Phase 5: Platforms Page (Testable: Platforms page with data)
- Build platforms scraper
- Create PlatformCard component
- Build /platforms page
- API route: GET /api/platforms

### Phase 6: Polish & Robustness (Testable: Production-quality UX)
- Loading skeletons and empty states
- Error handling and user feedback (toasts)
- Responsive design breakpoints
- Pagination
- Settings page (edit/delete universities)
- Background cron scheduling
- Final UI polish and animations

---

## 9. Error Handling Strategy

| Layer | Approach |
|-------|----------|
| Scraper | Try/catch per university, log errors, continue with others |
| API Routes | Return structured JSON errors with status codes |
| Frontend | Error boundaries + inline error states on cards |
| Database | Transactions for batch inserts; WAL mode for concurrent reads |

---

## 10. Security Considerations

- Proxy credentials stored in `.env.local` only (never committed)
- `.env.local` added to `.gitignore`
- No user-facing admin without authentication in v1
- Input sanitization on university add form
- Rate limiting on scrape API to prevent abuse
