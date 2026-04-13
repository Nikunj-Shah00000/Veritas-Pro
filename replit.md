# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

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

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### VeritasAI (artifacts/veritas-ai)
- **Type**: react-vite (frontend-only, no backend needed)
- **Preview path**: `/`
- **Port**: 26027
- **Description**: Full deepfake detection & authenticity verification website using AGQIS
- **Dependencies**: chart.js, react-chartjs-2, jspdf, html2canvas
- **Key files**:
  - `src/App.tsx` — Router, layout with particle background + nav + status bar
  - `src/index.css` — Dark quantum theme (cyan/green neon, glassmorphism)
  - `src/types/detection.ts` — DetectionReport, AIModelScore, QuantumMetrics types
  - `src/lib/detection.ts` — Detection simulation logic, SAMPLE_REPORTS
  - `src/components/ParticleBackground.tsx` — Canvas particle animation
  - `src/components/Navigation.tsx` — Top nav with active state
  - `src/components/QuantumStatusBar.tsx` — Live qubit/entanglement/QFLOPS status
  - `src/components/QuantumRadarChart.tsx` — 6-axis radar via Chart.js
  - `src/components/ReportModal.tsx` — Full report with PDF download
  - `src/components/AgentModal.tsx` — Quantum agent launcher
  - `src/pages/Dashboard.tsx` — Stats, model detection breakdown, recent detections
  - `src/pages/Detect.tsx` — Upload (local/URL/cloud), analysis, AI fingerprinting
  - `src/pages/Analysis.tsx` — Interactive demo, animated metrics
  - `src/pages/Reports.tsx` — Filterable report grid, click to view detail
  - `src/pages/Agents.tsx` — Live agent monitoring, log stream
  - `src/pages/About.tsx` — Mission, technology, how it works
