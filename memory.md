# UniAnalysis — Memory Log (memory.md)

> This file is the persistent memory of the AI agent. **Read this file before every change. Update it after every change.**

---

## Current Status

| Field | Value |
|-------|-------|
| **Current Phase** | Phase 2 — UI Core |
| **Phase Status** | ✅ Complete |
| **Last Updated** | 2026-05-11T12:15:00+05:00 |
| **Last Action** | Completed Phase 2 — all UI components built, mock news API working, dashboard renders with search, filters, sidebar, and add-university modal. Verified build + APIs + page load. |
| **Next Action** | Begin Phase 3 — Scraper Engine (blocked pending Windscribe credentials) |
| **Blockers** | Waiting for user to obtain Windscribe SOCKS5 proxy credentials |

---

## Phase Tracker

### Phase 0: Planning & Documentation ✅
- [x] Created PRD.md — Project Requirements Document
- [x] Created TDD.md — Technical Design Document
- [x] Created agents.md — AI Agent Instructions (Apple CLAUDE.md style)
- [x] Created memory.md — This file
- **Verification**: All 4 documents exist and are consistent with each other.

### Phase 1: Foundation ✅
- [x] Initialize Next.js project with `npx create-next-app`
- [x] Install dependencies: `better-sqlite3`, `axios`, `cheerio`, `socks-proxy-agent`, `node-cron`, `lucide-react`
- [x] Create `data/` directory
- [x] Implement `src/lib/db.js` — SQLite connection
- [x] Implement `src/lib/schema.js` — Table creation
- [x] Implement `src/lib/seed.js` — University seed data (25+ universities)
- [x] Create `src/app/layout.js` — Root layout shell
- [x] Create `src/app/page.js` — Dashboard placeholder
- [x] Create `src/app/globals.css` — Design tokens
- [x] Create `app/api/universities/route.js` — GET endpoint
- [x] Verify: App boots with `npm run dev`, DB created, seed data returned from API
- **Testable criteria**: `npm run dev` works, visiting `/api/universities` returns JSON list of 25+ universities

### Phase 2: UI Core ✅
- [x] Build `Sidebar.js` + `Sidebar.module.css`
- [x] Build `NewsCard.js` + `NewsCard.module.css`
- [x] Build `SearchBar.js` + `SearchBar.module.css`
- [x] Build `FilterBar.js` + `FilterBar.module.css`
- [x] Build `SkeletonCard.js` + `SkeletonCard.module.css`
- [x] Build `EmptyState.js` + `EmptyState.module.css`
- [x] Build `AddUniversityModal.js` + `AddUniversityModal.module.css`
- [x] Wire up search + filter state in Dashboard page
- [x] Create `app/api/news/route.js` — GET with mock data
- [x] Style everything with dark theme + glassmorphism
- [x] Verify: Full UI renders with mock data, search/filter work client-side
- **Testable criteria**: Dashboard shows news cards, sidebar lists universities, search debounces, filters toggle

### Phase 3: Scraper Engine ⬜
- [ ] Implement `src/lib/scraper/proxy.js` — SOCKS5 agent
- [ ] Implement `src/lib/scraper/fetcher.js` — HTTP with retry + UA rotation
- [ ] Implement `src/lib/scraper/parser.js` — HTML extraction
- [ ] Implement `src/lib/scraper/classifier.js` — Category classification
- [ ] Implement `src/lib/scraper/index.js` — Orchestrator
- [ ] Create `app/api/scrape/route.js` — POST trigger
- [ ] Create `.env.local` template
- [ ] Verify: Calling POST /api/scrape populates the news table
- **Testable criteria**: Scraper runs, fetches real data, inserts into DB, scrape_logs populated

### Phase 4: Integration ⬜
- [ ] Connect news API to real DB data (remove mock)
- [ ] Implement FTS5 search in news API
- [ ] Wire sidebar university click → filter API call
- [ ] Add refresh button to trigger scrape from UI
- [ ] Add scrape status indicator
- [ ] Verify: Live scraped data appears in the UI, search works, filters work
- **Testable criteria**: Real news from universities visible, searchable, filterable

### Phase 5: Platforms Page ⬜
- [ ] Implement `src/lib/scraper/platforms.js` — Platform scraper
- [ ] Build `PlatformCard.js` + `PlatformCard.module.css`
- [ ] Create `src/app/platforms/page.js`
- [ ] Create `app/api/platforms/route.js`
- [ ] Seed platform data
- [ ] Verify: /platforms page shows real data from prep platforms
- **Testable criteria**: Platforms page renders with scraped data for ≥5 platforms

### Phase 6: Polish & Robustness ⬜
- [ ] Add loading skeletons everywhere
- [ ] Add error toasts/notifications
- [ ] Implement responsive breakpoints
- [ ] Add pagination to news feed
- [ ] Create settings page (edit/delete universities)
- [ ] Set up background cron job
- [ ] Final animation polish
- [ ] Verify: App works across viewport sizes, handles errors gracefully
- **Testable criteria**: No console errors, responsive at all breakpoints, cron runs silently

---

## Change Log

| Date | Phase | Action | Files Changed | Notes |
|------|-------|--------|---------------|-------|
| 2026-05-11 | 0 | Created all documentation files | PRD.md, TDD.md, agents.md, memory.md | Initial project setup. User approval needed before Phase 1. |
| 2026-05-11 | 1 | Completed Phase 1 — Foundation | memory.md, src/lib/schema.js, src/app/api/universities/route.js | Fixed duplicate seeding bug with UNIQUE index. Moved API route into src/app/. Verified build + dev server + /api/universities returns 25 universities. |
| 2026-05-11 | 2 | Completed Phase 2 — UI Core | src/components/*, src/app/api/news/route.js, src/app/page.js, src/app/api/universities/route.js | Built all UI components with dark theme + glassmorphism. Mock news API with 25 items. Dashboard fully wired with search (300ms debounce), category filters, sidebar selection, refresh, and add-university modal. Verified build + APIs + page load. |

---

## Known Issues

_None yet._

---

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| `better-sqlite3` over `sql.js` | Sync API is simpler for Next.js API routes, better performance for local use |
| Vanilla CSS over Tailwind | User did not request Tailwind; vanilla gives more control for glassmorphism effects |
| App Router over Pages Router | Modern Next.js standard, better for server components |
| Keyword-based classifier | Simple and fast for v1; can upgrade to ML-based in future |
| FTS5 for search | Built into SQLite, no extra dependencies, fast enough for local use |

---

## Environment Notes

- **OS**: Windows
- **Workspace**: `c:\Users\Mustafa\Desktop\UniAnalysis`
- **Node**: ≥ 18 required
- **Proxy**: Windscribe SOCKS5 at `proxy.windscribe.com:1080`
