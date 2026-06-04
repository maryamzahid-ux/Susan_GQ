# GQ Platform — Gut Intelligence® by Susan K. Wehrley

A multi-role coaching platform built around Susan K. Wehrley's trademarked
Gut Intelligence® (GQ) methodology. Three portals (Admin / Organization /
Individual), a real GQ assessment + scoring engine, an AI coach grounded in
Susan's framework, a coaching library, certification tracks, and her real
books, articles, and programs.

## Run locally

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Enable the AI Coach (optional)
The AI Coach calls the Anthropic API through a secure Vite proxy so your key
never touches the browser.

1. `cp .env.example .env`
2. Paste your key into `.env`:  `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart `npm run dev`

Without a key, the whole app works; only the AI Coach replies with a fallback.

## Accounts & roles
- **Sign up** on any portal (Organization / Individual) — creates a persisted
  local account (stored in your browser).
- **Admin demo (Susan):** `susan@bizremedies.com` / `gutintelligence`
- Login enforces the correct role per portal.

## How the GQ Score is calculated
Per Susan's methodology, GQ = the synthesis of four information centers:
**Gut** (the Gut-Alert), **Heart** (the Heart's Desire), **Head** (the Field
of Possibilities), and **Intuition** (the "a-ha" knowing). Individuals take an
8-item Likert (1–5) assessment, two questions per center. Each center is
normalized to 0–100 and the four are weighted equally to produce the overall
GQ. See `src/lib/gq.js`.

## Project structure
```
src/
  lib/      data.js (real Susan content) · gq.js (scoring) · auth.js (auth store)
  components/ui.jsx
  screens/  Auth · Assessment · AICoach · Views
  App.jsx   routing + sidebar
```

Content sourced from bizremedies.com (methodology, books, Forbes articles,
programs). Demo client names are organizations Susan has publicly worked with.
