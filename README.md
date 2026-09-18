# Research Muse

Research Muse is a student research workspace for moving from an early question to a documented research project without treating generated text or a polished UI as scientific evidence.

## Current product scope

The application currently includes:

- guided brainstorming and question refinement;
- literature-review and source-import flows;
- methodology and statistics helpers;
- data-analysis and charting surfaces;
- writing feedback and revision support;
- plagiarism/overlap-risk checks;
- integrity and ethics review prompts;
- project export;
- local mock authentication and local project persistence when Supabase is not configured.

This is a **research-support product**, not a Project 2424 scientific result by itself. Product features, CI, builds, demos, or generated drafts must not be cited as evidence that a research hypothesis is supported.

## Stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase when configured, with local demo fallbacks otherwise

## Local development

Requirements: Node.js and npm.

```bash
git clone https://github.com/THE-BU1LD/ResearchPilot.git
cd ResearchPilot
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment setup

For local Supabase-backed development:

```bash
cp .env.example .env
```

Populate only the browser-safe `VITE_*` client values needed by the app. Do **not** place Supabase service-role keys, database passwords, provider credentials, or other server-side secrets in `.env` values exposed through Vite.

Local `.env` files are intentionally ignored; `.env.example` is the only environment template committed to the repository.

## Backend behavior

The repository is designed to remain usable without backend credentials.

When valid Supabase configuration is present, the application can use the configured backend. When it is absent, development/demo flows fall back to local behavior rather than pretending that cloud persistence exists.

Do not commit service-role keys, private participant records, credentials, or other access-controlled research data to this repository.

## Deployment

No canonical production URL is asserted by this README.

A deployment should be treated as canonical only after the repository records the intended host/provider, exact source revision, required environment variables, and a verification path. Placeholder hosting/project IDs are deliberately not kept here.

## Research and integrity boundary

Research Muse can assist with planning, organization, source handling, analysis workflows, and writing feedback. It must not silently manufacture:

- experimental results;
- citations that were not verified;
- participant or dataset provenance;
- ethics/approval status;
- plagiarism-clearance claims;
- publication or acceptance claims.

Scientific conclusions belong to the relevant research project's retained evidence and protocol, not to this product repository.

## Portfolio routing

Canonical repository: `THE-BU1LD/ResearchPilot`.

Cross-project research status and evidence should remain in the relevant canonical research repository/control ledger rather than being copied into Research Muse as if this product produced the evidence.
