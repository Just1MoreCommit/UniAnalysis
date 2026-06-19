# UniAnalysis — Project Requirements Document (PRD)

## 1. Project Overview

**UniAnalysis** is a locally-hosted web application that aggregates, categorises, and displays the latest entrance-exam news from Pakistani universities and exam-preparation platforms. It runs on `npm run dev` (Next.js dev server) with a SQLite database and uses a Windscribe SOCKS5 proxy for scraping.

### 1.1 Goals

| # | Goal |
|---|------|
| G1 | Provide a single dashboard for all Pakistani university entrance-exam updates |
| G2 | Auto-scrape university websites and prep-platform sites on a schedule |
| G3 | Categorise news with filters (Test Updates, Admissions, Scholarships, etc.) |
| G4 | Let users search and browse by university name |
| G5 | Track exam-prep platforms (pricing, courses, changes) on a dedicated page |

### 1.2 Non-Goals (v1)

- User authentication / multi-user support
- Deployment to production (local-only)
- Mobile-native apps
- Push notifications

---

## 2. Target Users

| Persona | Description |
|---------|-------------|
| **Aspirant** | FSc / A-Level student preparing for NET, LCAT, FAST test, etc. |
| **Parent / Guardian** | Wants to stay updated on admission windows and fee changes |
| **Counsellor** | School/academy counsellor advising multiple students |

---

## 3. Functional Requirements

### 3.1 Dashboard (Home Page — `/`)

| ID | Requirement |
|----|-------------|
| F-01 | **Left Sidebar** — Scrollable list of all Pakistani universities (name + logo). Clicking a university filters the news feed. |
| F-02 | **Add University** — Button at the top of the sidebar to manually add a new university (name, abbreviation, website URL, logo URL). |
| F-03 | **News Feed (Body)** — Vertically stacked cards, newest first. Each card: university logo (left), title (clickable link to source), description snippet, category badge, date. |
| F-04 | **Search Bar** — Top of body. Full-text search across title + description. Debounced (300 ms). |
| F-05 | **Filter Bar** — Horizontal pill/chip filters below search bar. |
| F-06 | **Refresh Button** — Manually trigger a scrape cycle from the UI. |
| F-07 | **Loading / Empty States** — Skeleton cards while loading; friendly empty state when no results. |

### 3.2 Filter Categories

| Filter | What it captures |
|--------|-----------------|
| **All** | No filter — show everything |
| **Test Updates** | Pattern changes, test delays, new test dates, syllabus changes |
| **Admissions** | Admission open/close dates, eligibility criteria, merit lists |
| **Scholarships** | New scholarships, financial aid, fee waivers |
| **Results** | Merit list announcements, test results |
| **Fee Changes** | Tuition / test fee increases or restructuring |
| **General** | Campus news, events, anything else |

### 3.3 Prep Platforms Page (`/platforms`)

| ID | Requirement |
|----|-------------|
| F-10 | Dedicated page listing exam-prep platforms in card format. |
| F-11 | Each card: platform logo, name, tagline, link, courses list, pricing. |
| F-12 | Scraper pulls latest data from platform websites. |
| F-13 | "Last Updated" timestamp per platform. |
| F-14 | Search/filter within platforms. |

### 3.4 Prep Platforms to Track

| Platform | Website |
|----------|---------|
| NUSTrive | nustrive.com |
| PASS Education | passeducation.pk |
| TopGrade.pk | topgrade.pk |
| KIPS | kipsprep.com |
| Tabir Academy | tabiracademy.com |
| Horizon Preps | horizonpreps.com |
| OETP | oetp.pk |

### 3.5 University Management

| ID | Requirement |
|----|-------------|
| F-20 | Pre-seeded database with 25+ major Pakistani universities. |
| F-21 | Add new university via sidebar form. |
| F-22 | Edit / delete university from settings view. |

---

## 4. University Seed Data

| University | Abbreviation | Admissions URL |
|------------|-------------|----------------|
| National University of Sciences & Technology | NUST | ugadmissions.nust.edu.pk |
| Lahore University of Management Sciences | LUMS | admissions.lums.edu.pk |
| FAST-NUCES | FAST | admissions.nu.edu.pk |
| Aga Khan University | AKU | aku.edu/admissions |
| Quaid-i-Azam University | QAU | qau.edu.pk |
| University of Engineering & Technology Lahore | UET | uet.edu.pk |
| COMSATS University | COMSATS | comsats.edu.pk |
| University of Punjab | PU | pu.edu.pk |
| Ghulam Ishaq Khan Institute | GIKI | giki.edu.pk |
| NED University | NED | neduet.edu.pk |
| University of Karachi | KU | uok.edu.pk |
| Bahria University | BU | bahria.edu.pk |
| Air University | AU | au.edu.pk |
| Institute of Business Administration | IBA | iba.edu.pk |
| University of Peshawar | UoP | uop.edu.pk |
| University of Health Sciences | UHS | uhs.edu.pk |
| Dow University of Health Sciences | DUHS | duhs.edu.pk |
| King Edward Medical University | KEMU | kemu.edu.pk |
| Allama Iqbal Open University | AIOU | aiou.edu.pk |
| PIEAS | PIEAS | pieas.edu.pk |
| IST Islamabad | IST | ist.edu.pk |
| Habib University | HU | habib.edu.pk |
| SZABIST | SZABIST | szabist.edu.pk |
| University of Lahore | UoL | uol.edu.pk |
| Mehran University | MUET | muet.edu.pk |

---

## 5. Scraping Requirements

### 5.1 Proxy Configuration

| Setting | Value |
|---------|-------|
| Protocol | SOCKS5 |
| Host | `proxy.windscribe.com` |
| Port | `1080` |
| Auth | `WINDSCRIBE_PROXY_USER` / `WINDSCRIBE_PROXY_PASS` env vars |

### 5.2 Strategy

1. **HTTP-first** — Use `axios` through the SOCKS5 proxy to fetch HTML.
2. **Cheerio parsing** — Parse HTML with `cheerio` for static pages.
3. **Fallback: Puppeteer** — For JS-rendered pages (Phase 4+).
4. **Rate limiting** — Max 2 concurrent requests; 2s delay per domain.
5. **User-Agent rotation** — 5+ realistic browser User-Agent strings.
6. **Retry logic** — Exponential backoff, max 3 retries.
7. **Deduplication** — Hash (title + source URL) to avoid duplicates.

### 5.3 Schedule

| Trigger | Interval |
|---------|----------|
| On app start | Once |
| Manual refresh | On-demand via UI button |
| Background cron | Every 6 hours (configurable) |

### 5.4 Data Extraction

For each university page, extract:
- **Title** of the news/announcement
- **URL** (absolute link to source)
- **Description** (first 300 chars or meta description)
- **Date** (parsed from page, else scrape timestamp)
- **Category** (auto-classify via keyword matching)

---

## 6. Search & Filtering

| Feature | Implementation |
|---------|---------------|
| Full-text search | SQLite FTS5 virtual table on `title` + `description` |
| University filter | Click sidebar university → filter by `university_id` |
| Category filter | Click filter pill → filter by `category` |
| Combined filters | University + category + search text simultaneously |
| Sort | Newest first (default), oldest first, alphabetical |

---

## 7. UI/UX Requirements

### 7.1 Design Reference

Similar to [CompetitorPulse](https://competitor-pulse-mauve.vercel.app/):
- **Dark theme** with blue/purple gradient accents
- **Left sidebar** for university list navigation
- **Card-based news feed** in main body
- **Glassmorphism** touches on cards and sidebar
- **Smooth micro-animations** on hover and card load
- **Inter font** from Google Fonts

### 7.2 Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| ≥ 1024 px | Sidebar visible, multi-column cards |
| 768–1023 px | Collapsible sidebar (hamburger), single-column |
| < 768 px | Sidebar as drawer, full-width cards |

### 7.3 Accessibility

- Keyboard-navigable interactive elements
- Colour contrast ≥ 4.5:1 (WCAG AA)
- `alt` text on all university logos

---

## 8. Environment Variables (`.env.local`)

```env
WINDSCRIBE_PROXY_USER=your_proxy_username
WINDSCRIBE_PROXY_PASS=your_proxy_password
WINDSCRIBE_PROXY_HOST=proxy.windscribe.com
WINDSCRIBE_PROXY_PORT=1080
SCRAPE_INTERVAL_HOURS=6
SCRAPE_MAX_CONCURRENT=2
SCRAPE_DELAY_MS=2000
DATABASE_PATH=./data/unianalysis.db
```

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Universities seeded | ≥ 25 |
| News items scraped on first run | ≥ 20 |
| Filter categories working | All 7 |
| Search returns results | Within 200 ms |
| Prep platforms tracked | ≥ 5 |
