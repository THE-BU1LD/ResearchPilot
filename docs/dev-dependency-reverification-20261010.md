# Development dependency fixes and remaining upstream limits

Date: 2026-10-10. Base: application migration PR
[#18](https://github.com/THE-BU1LD/ResearchPilot/pull/18), commit
`92c8a43ed81b93ffc47d22ffdd9246a33d251dd8`.

## Scope and measured result

This bounded follow-up updates the development toolchain through dependencies
that its actual consumers support. It does not change application source,
production dependencies, ESLint rules, the lint baseline, or CI gates. All 159
existing production lock records are preserved. No override, audit exception,
dependency reclassification, or removal of development tagging is used.

The saved full audit of #18 reported **23 affected packages: 17 high and 6
moderate**. The updated lock reports **8 affected packages: 5 high and 3
moderate**, all within the retained Lovable/Tailwind 3 development chain. These
are npm's affected-package counts, not 23 or 8 independent vulnerabilities.
The production audit remains **0 findings**. The full audit still exits with
status 1; this is a partial repair, not an all-clear result. Advisory snapshots
can change over time.

## Compatible changes

| Package | Previous lock | Updated lock |
| --- | --- | --- |
| `vite` | 5.4.19 | 6.4.4 |
| Root `esbuild` | 0.21.5 | 0.25.12 |
| `rollup` | 4.24.0 | 4.64.3 |
| `eslint`, `@eslint/js` | 9.32.0 | 9.39.5 |
| `typescript-eslint` family | 8.38.0 | 8.71.1 |
| `@humanfs/node` | 0.16.6 | 0.16.8 |
| `ajv` | 6.12.6 | 6.15.0 |
| Root `brace-expansion` | 1.1.12 | 1.1.21 |
| `flatted` | 3.3.1 | 3.4.4 |
| `js-yaml` | 4.1.0 | 4.3.2 |
| Root `minimatch` | 3.1.2 | 3.1.5 |

Only Vite's direct manifest requirement changes, from `^5.4.19` to `^6.4.4`.
The other direct updates remain within the declared ranges; npm resolves their
transitive versions normally. The installed React SWC plugin 3.11.0 declares
Vite `^4 || ^5 || ^6 || ^7`; the retained Lovable tagger 1.1.13 declares Vite
`>=5.0.0 <8.0.0`. Both admit Vite 6.

Vite 5 is outside upstream support; Vite 6.4 still receives security backports.
Version 6.4.4 also fixes
[GHSA-rq7h-c2jc-7f22](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22),
published on October 6 after the earlier advisory snapshot. The Vite 5-to-6
migration guide was checked against this application's configuration: it does
not use SSR, custom resolution conditions, Sass, library-mode output, or range
brace globs. Existing aliases, external-module configuration and the
development-only `componentTagger()` registration remain unchanged.

## Exact remaining blockers

The retained graph is `lovable-tagger@1.1.13 -> tailwindcss@3.4.19`, with these
remaining audit nodes:

| Severity | Affected packages |
| --- | --- |
| High | `braces`, `chokidar`, `fast-glob`, `micromatch`, nested `tailwindcss` |
| Moderate | `postcss-selector-parser`, `postcss-nested`, `lovable-tagger` |

`braces@3.0.3` has no published patched version for
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
Tailwind 3 and `postcss-nested@6.2.0` require selector-parser 6.x, while
[GHSA-rj75-hqrm-r3gf](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf)
is fixed in 7.1.6. Forcing 7.x would exceed both consumers' declared ranges.

An independent check of the current published `lovable-tagger@1.3.5` manifest
and distribution confirms that it still requires `tailwindcss:^3.4.17` and
imports `tailwindcss/resolveConfig.js` at module scope. Its added Tailwind 4
design-system support does not remove that dependency. Disabling an optional
feature cannot remove an installed vulnerable package from the audit. The
audit's suggested downgrade to 1.0.20 is not applied, and a Tailwind 4 override
would break the required module API. Clearing this chain requires an upstream
repair or a separately reviewed replacement that preserves the tagging
contract.

ESLint 9.39.5 is the final available release in its major and is end-of-life.
The installed `eslint-plugin-react-hooks@5.2.0` peer range admits ESLint through
9, not 10. The current findings were repaired within that supported peer
relationship; a maintained ESLint 10 migration remains separate work requiring
plugin compatibility and rule verification. This snapshot does not claim that
ESLint 9 will receive future fixes.

## Verification

Local verification used Node 24.19.0, npm 11.9.0, Playwright 1.64.0 and the
separately installed Chromium 153.0.8010.0 already used to review #18. The
unchanged hosted workflow uses Node 22.23.2 and installs Playwright's pinned
Chromium.

- Fresh `npm ci` and `npm ls` pass with no invalid selected peer dependencies.
- The unchanged lint non-regression gate passes: **8 known errors, 19 warnings,
  no new errors**.
- TypeScript project compilation and all **30 deterministic CSV/analysis tests**
  pass.
- The production build and all **5 browser tests** pass, covering navigation,
  real CSV calculations/export, invalid input retention, compiled theme styles
  and mobile focus behavior. The existing large-chunk warning remains.
- An actual local development server serves application HTML, the SWC-compiled
  `Index.tsx` module and compiled Tailwind 4 CSS with the configured Lovable
  plugin present. A separate local fixture explicitly enables the installed
  tagger's JSX feature and checks that the transformed module resolves through
  its real virtual source-tagging runtime. Application defaults are unchanged.
- Both production and full audit commands were executed; their different
  results are reported above.

The first manual CSS smoke assertion expected an emitted `--color-background`
token, but the existing inline theme correctly compiles that alias into its
consumers. The assertion was corrected to recognize the compiled Tailwind
stylesheet; the five unchanged browser style/workflow tests passed throughout.
No application CSS was changed for that check. These tests do not exercise a
deployed Lovable environment, cloud authentication, or every product panel.

## Primary references

- [Vite support policy](https://vite.dev/releases)
- [Vite 5-to-6 migration guide](https://v6.vite.dev/guide/migration)
- [React SWC 3.11.0 published package](https://www.npmjs.com/package/@vitejs/plugin-react-swc/v/3.11.0)
- [Lovable tagger 1.3.5 published package](https://www.npmjs.com/package/lovable-tagger/v/1.3.5)
- [ESLint version support](https://eslint.org/version-support/)
- [React Hooks 5.2.0 published package](https://www.npmjs.com/package/eslint-plugin-react-hooks/v/5.2.0)
