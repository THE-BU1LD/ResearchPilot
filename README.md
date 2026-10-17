# Research Muse

> **Repository authority:** `THE-BU1LD/ResearchPilot` is canonical for the **Research Muse product only**. Cross-project Bu1LD research routing, portfolio CI governance, repository identity/provenance decisions, and unrelated research-program authority belong in [`THE-BU1LD/org-infra-`](https://github.com/THE-BU1LD/org-infra-) and the canonical Bu1LD Nexus control board. Existing cross-project issues in this repository are retained as historical migration evidence; do not open new portfolio-control work here.

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

## What belongs in this repository

Open work here only when it is specific to Research Muse, including:

- product code and UX;
- Research Muse authentication, persistence, deployment, security, and accessibility;
- product-specific user research;
- product documentation and tests.

Do **not** use this repository as the source of truth for:

- Space-JEPA, NPMS, LAM-JEPA, NeuroCAD, or other independent research programs;
- portfolio-wide repository routing or identity decisions;
- organization-wide Actions/CI governance;
- cross-project evidence ledgers or publication authority.

Route those items to the canonical research repository or to the organization control plane above, while preserving links back to any historical ResearchPilot issue that contains relevant provenance.

## Stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase when configured, with local demo fallbacks otherwise

## Local development

Requirements: Node.js 22.23.2 (the CI version) and npm. Use `package-lock.json`
for reproducible installs; npm is the repository's package manager.

```bash
git clone https://github.com/THE-BU1LD/ResearchPilot.git
cd ResearchPilot
npm ci
npm run dev
```

Useful checks:

```bash
npm audit --omit=dev --audit-level=high
node scripts/ci/lint-baseline.mjs
npx tsc -b --pretty false
node --test scripts/ci/data-analysis.test.mjs
npm run build
npx playwright install --with-deps chromium
npm run test:browser
```

Preview the production build locally:

```bash
npm run preview
```

The browser checks start their own preview server on port 4173. They use a build
without Supabase credentials and exercise routes, CSV imports and exports,
calculated fallback summaries, bundled fonts, theme tokens and keyboard focus.
For an existing local Chromium installation, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path; CI uses the browser
version pinned by Playwright.

Tailwind CSS 4 requires Safari 16.4+, Chrome 111+ or Firefox 128+.
See the [dependency migration record](docs/dependency-migration-20261010.md)
for the compatibility changes and the retained audit gate.

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

Application components import the shared client from `@/lib/supabase` so they
all use this configuration check. The generated integration client requires
credentials at module initialization and must not bypass this shared entry point.

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

### Data Analysis calculations

The Data Analysis panel calculates summaries, ordinary least-squares regression,
Pearson correlation, target differences and point extrapolations from its current
rows. Regression and correlation use **row index (1 through n)** as the predictor;
category labels are not interpreted as dates. Constant values have undefined
Pearson correlation and R². Extrapolations do not include inferred p-values,
confidence percentages or prediction intervals. AI commentary remains a separate
optional interpretation of the computed summary.

CSV imports require `category,value,growth,target` columns. Extra columns are
retained. Numeric fields accept complete finite decimal/scientific numbers;
missing values, unit suffixes and nonfinite values are rejected. Quoted commas,
escaped quotes and quoted newlines are supported. Files are bounded to 1 MiB and
10,000 rows. Invalid files leave the current dataset and calculated results in
place; successful imports clear results from the previous dataset. Charts and
the exported JSON summary use the displayed data. A pie chart requires
nonnegative values and a positive total.

Numerical and import verification:

```bash
node --test scripts/ci/data-analysis.test.mjs
npx tsc -b --pretty false
node scripts/ci/lint-baseline.mjs
npm run build
```

These are product software checks using constructed inputs. They do not execute
or change any portfolio research study. Open **Data Analysis** in the workspace
sidebar to use the calculations. The collapsed **Statistical examples — separate
sample data** section preserves the existing Advanced Statistics illustration;
it does not analyze the CSV imported above it.

## Portfolio routing

Canonical product repository: `THE-BU1LD/ResearchPilot`.

Cross-project research status, evidence, routing, identity/provenance, and portfolio governance should remain in the relevant canonical research repository or central organization control plane rather than being copied into Research Muse as if this product produced or governed the evidence.
