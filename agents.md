# UniAnalysis — Agent Instructions (agents.md)

> Inspired by Apple's CLAUDE.md pattern. This file serves as persistent memory and architectural guardrails for any AI coding agent working on this project.

---

## Identity & Role

You are an AI coding agent working on **UniAnalysis**, a Next.js web application that scrapes and displays Pakistani university entrance exam news. Your job is to implement features, fix bugs, and maintain code quality according to the patterns established in this file.

---

## Critical Rules — READ FIRST

1. **ALWAYS read `memory.md` before making ANY changes.** It contains the current phase, completed work, and context you need.
2. **ALWAYS update `memory.md` after making changes.** Log what you did, what phase you're in, and any issues encountered.
3. **NEVER commit proxy credentials.** They live in `.env.local` which is gitignored.
4. **NEVER skip the testing step.** Every phase must be verified before moving on.
5. **Follow the phase order in TDD.md §8.** Do not jump ahead.

---

## Architecture & Patterns

### Framework
- **Next.js 14 App Router** — Use `app/` directory, NOT `pages/`.
- Server Components by default. Add `'use client'` only when client interactivity is needed (state, effects, event handlers).
- API routes use the `route.js` convention in `app/api/`.

### Database
- **`better-sqlite3`** — synchronous API. Do NOT use async SQLite libraries.
- All DB access goes through `src/lib/db.js`. Never create direct connections elsewhere.
- Use **prepared statements** for all queries — never string-interpolate user input.
- Enable **WAL mode** on connection init: `db.pragma('journal_mode = WAL')`.
- Schema changes go in `src/lib/schema.js`.

### Styling
- **Vanilla CSS** with CSS Modules (`.module.css` per component).
- Design tokens in `src/app/globals.css` as CSS variables.
- Do NOT use Tailwind, styled-components, or any CSS-in-JS library.
- Dark theme is the only theme. No light mode toggle needed.

### Scraper
- All scraper code lives in `src/lib/scraper/`.
- HTTP requests MUST go through the Windscribe SOCKS5 proxy (see `proxy.js`).
- Rate limit: max 2 concurrent, 2s delay between same-domain requests.
- Every scrape attempt must be logged to `scrape_logs` table.
- Use `cheerio` for HTML parsing. Puppeteer is Phase 4+ only.

### Components
- Functional components only (no class components).
- Co-locate styles: `ComponentName.js` + `ComponentName.module.css`.
- Props should be destructured in the function signature.
- No prop-drilling beyond 2 levels — use React Context or URL params.

---

## Forbidden Patterns

| ❌ Do NOT | ✅ Do Instead |
|-----------|--------------|
| Use `pages/` directory | Use `app/` directory (App Router) |
| Use Tailwind CSS | Use Vanilla CSS + CSS Modules |
| Use async SQLite (`sql.js`, `sqlite3`) | Use `better-sqlite3` (sync) |
| String-interpolate SQL | Use prepared statements |
| Import `socks-proxy-agent` outside `proxy.js` | Import the pre-configured agent from `proxy.js` |
| Hardcode proxy credentials | Read from `process.env` |
| Skip `memory.md` updates | Always read then update `memory.md` |
| Create files outside the project structure in TDD.md §3 | Follow the established file structure |
| Use `fetch` for scraping | Use `axios` with the SOCKS5 agent |

---

## File Organisation

```
src/
├── app/           → Pages and API routes (Next.js App Router)
├── components/    → Reusable React components
└── lib/           → Business logic, DB, scraper
    ├── db.js      → Single DB connection export
    ├── schema.js  → CREATE TABLE statements
    ├── seed.js    → University seed data
    └── scraper/   → All scraping logic
```

### Naming Conventions
- Files: `camelCase.js` for lib, `PascalCase.js` for components
- CSS modules: `PascalCase.module.css`
- API routes: `route.js` inside descriptive folder (`app/api/news/route.js`)
- Database columns: `snake_case`
- JS variables: `camelCase`
- React components: `PascalCase`
- CSS classes: `camelCase` (in CSS modules)
- Environment variables: `SCREAMING_SNAKE_CASE`

---

## Development Workflow

### For each change:
1. **Read** `memory.md` — understand current state
2. **Plan** — identify files to change, check TDD.md for patterns
3. **Implement** — write code following the patterns above
4. **Test** — run `npm run dev`, verify the feature works
5. **Update** `memory.md` — log what was done, current phase status

### For each phase:
1. Complete all items in the phase checklist (see TDD.md §8)
2. Verify the "Testable" criteria is met
3. Update `memory.md` with phase completion status
4. Move to next phase only after verification passes

---

## Environment Setup

Required `.env.local` variables:
```
WINDSCRIBE_PROXY_USER=     # Windscribe proxy username
WINDSCRIBE_PROXY_PASS=     # Windscribe proxy password
WINDSCRIBE_PROXY_HOST=proxy.windscribe.com
WINDSCRIBE_PROXY_PORT=1080
SCRAPE_INTERVAL_HOURS=6
DATABASE_PATH=./data/unianalysis.db
```

---

## Debugging Tips

- **DB issues**: Check if `./data/` directory exists. `better-sqlite3` won't create parent dirs.
- **Proxy failures**: Test proxy independently first: `curl --socks5 user:pass@proxy.windscribe.com:1080 https://httpbin.org/ip`
- **Scraper returning empty**: Check if the university page actually has news items. Log the raw HTML to debug selectors.
- **FTS5 not working**: Ensure the virtual table is created and the triggers for syncing are in place.
- **CSS not loading**: Check that `globals.css` is imported in `layout.js`.

---

## Context for the AI Agent

### What this project IS:
A local-first news aggregator for Pakistani university entrance exams. Think of it as a specialized RSS reader with scraping, search, and filtering built in.

### What this project is NOT:
- A social platform (no users, no comments)
- A production deployment (no CI/CD, no Docker)
- A mobile app
- An exam prep tool itself (we aggregate info, not create content)

### Key domain terms:
- **NET** — NUST Entrance Test
- **LCAT** — LUMS Common Admission Test
- **ECAT** — Engineering College Admission Test
- **MDCAT** — Medical & Dental College Admission Test
- **FSc** — Faculty of Science (intermediate education in Pakistan)
- **Merit List** — Ranked list of accepted candidates
- **NTS** — National Testing Service
