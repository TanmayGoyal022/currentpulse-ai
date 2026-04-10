# CurrentPulse AI

## Overview

A full-stack web application that automatically collects, AI-processes, and presents daily current affairs for UPSC, HCS, and other government exam aspirants.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion

## Application Features

1. **Dashboard** — Today's stats, recent articles, trending topics by GS paper
2. **Daily Feed** — Searchable articles filtered by category, date, exam relevance
3. **Article Detail** — Read/Listen/Watch modes, Key Points, Background, Analysis, Exam Relevance
4. **Bookmarks** — Save and review articles
5. **My Notes** — Personal notes linked to articles or standalone
6. **Daily Quiz** — MCQ quiz generated from recent articles with explanations
7. **Categories** — GS1/GS2/GS3/GS4 paper navigation
8. **Weekly Compilations** — Past week's articles grouped by category

## Database Schema

- `articles` — News articles with AI-generated UPSC summaries (keyPoints, background, analysis, examRelevance)
- `bookmarks` — User saved articles
- `notes` — User personal notes (optionally linked to articles)
- `quiz_questions` — MCQ questions linked to articles

## Categories

- Polity & Governance → GS2
- Economy → GS3
- Environment & Ecology → GS3
- International Relations → GS2
- Science & Technology → GS3

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/currentpulse run dev` — run frontend locally

## Architecture

```
artifacts/
  api-server/     — Express 5 REST API
  currentpulse/   — React + Vite frontend
lib/
  api-spec/       — OpenAPI 3.1 spec + orval codegen config
  api-client-react/ — Generated React Query hooks
  api-zod/        — Generated Zod schemas for API validation
  db/             — Drizzle ORM schema and client
```

## Routing

- `/api` → API server (Express)
- `/` → Frontend app (React + Vite)
