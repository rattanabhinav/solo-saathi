# SoloSaathi Product Strategy

## What is the product
SoloSaathi is a pre-trip compatibility matching platform for self-organised solo trekkers

## Product Goal
Match 2-4 self-organised solo trekkers by deep compatibility — trail stamina, travel style, social vibe, safety behaviour — so they arrive at the trailhead already feeling like friends

## Target Customer
Urban Indians aged 22-38, solo travellers, primarily Tier 1 cities, trekking 1-3 times a year, active on Instagram, moderate-to-high disposable income

## Core Problem
- Solo trekkers want autonomy but not isolation
- They want to go alone (autonomy, no compromise on pace or itinerary) but they shouldn't go entirely alone (safety, cost-sharing, emotional support on hard days, someone to pull you out if altitude sickness hits)
- "Solo by identity" but "not entirely alone by necessity"
- Existing solutions are either full-group agencies, only city social catchups or unstructured forums with zero compatibility signal

## Unique Value Proposition
- The only platform where solo trekkers find compatible trail companions and build psychological safety *before* the trek begins — not a logistics tool, a friendship engine
- The value isn't logistics coordination (split the cost of a cab). The value is *psychological safety before the trip begins*
- That trust and emotional architecture is the product
- "Friends on rent, not co-travellers"

## Commands
```bash
# Development
npm run dev        # Start dev server (Next.js on localhost:3000)
npm run build      # Production build
npm start          # Serve production build
npx tsc --noEmit   # Type-check — builds skip type errors, so run this before committing
```

Use **npm** — `package-lock.json` is the only lock file. Don't use pnpm or yarn; they'd create a second, conflicting lock file

`npm run lint` exists in `package.json` but fails — ESLint isn't installed or configured. Use the type-check above instead

No test suite exists yet

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- React 19
- Tailwind CSS v4 + shadcn/ui
- Supabase: Postgres + email/password auth
- Matching and connection-request logic are Postgres functions (SQL in `supabase/migrations/`), called from the browser via `supabase.rpc()`
- Deployed on Vercel
- [Repo on GitHub](https://github.com/rattanabhinav/solo-saathi)

## Notable Config
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — builds pass even with type errors.
- Tailwind v4 is configured via `postcss.config.mjs` using `@tailwindcss/postcss`; there is no separate `tailwind.config.*` file.
- Path alias `@/` maps to the repo root (set in `tsconfig.json`).
- Vercel Analytics is only injected when `NODE_ENV === 'production'`.

## Conventions
- Use TypeScript strictly, no `any` types
- Keep components in /components, pages in /app
- Explain Supabase/SQL concepts simply — I'm a PM learning to code, 
  not a software engineer. Prioritize clarity over cleverness
- Always tell me WHY you're making a technical choice, briefly
- Don't run `git push` automatically — I'll review and push myself

## AI Features
1. Vibe Summary - @docs/features/vibe_summary.md