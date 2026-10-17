# Application dependency and browser verification update

## Starting point

This change is stacked on PR [#17](https://github.com/THE-BU1LD/ResearchPilot/pull/17),
source `7e968df19d31e9f2bfb7bdc121f07a08938b1670`. That source's
[Application CI run](https://github.com/THE-BU1LD/ResearchPilot/actions/runs/38021849765)
failed its production dependency audit. The failure remains part of the record.
After the compatible `source-map-js` repair in #17, the local production audit
still reported five high and four moderate findings through Tailwind 3's
braces/glob/selector-parser dependencies and React Router 6. The hosted advisory
snapshot reported an additional moderate finding; advisory databases change.

The audit command remains `npm audit --omit=dev --audit-level=high`. No dependency
has been moved from runtime to development to evade that gate, and no advisory
allowlist, audit override or skipped CI step has been introduced.

## Dependency changes

| Dependency | Previous locked version | New locked version or action |
| --- | --- | --- |
| `react-router-dom`, `react-router` | 6.30.6 | 7.18.4 |
| `tailwindcss` | 3.4.17 | 4.3.3 |
| `@tailwindcss/postcss` | absent | 4.3.3 |
| `tailwind-merge` | 2.6.0 | 3.7.0 |
| `@tailwindcss/typography` | 0.5.16 | Removed: unused by the configuration and source |
| `autoprefixer` | 10.4.21 | Removed: Tailwind 4 supplies prefixing |
| `@playwright/test` | absent | 1.64.0, development verification |

The explicit PostCSS requirement is now `^8.5.16`; its existing root lock remains
8.5.28. npm resolves the PostCSS plugin's own supported dependency graph. There
are no forced transitive overrides. React 18 and the Supabase SDK are unchanged.
The stale Bun lock is removed so automated upgrades and contributors use the same
`package-lock.json` as CI.

React Router 7 retains the `react-router-dom` compatibility exports used by this
application. Its declarative routes have no multi-segment splat requiring route
restructuring. Navigation, browser history, wildcard routing and project query
parameters are exercised against the built application.

Tailwind 4 changes its PostCSS entry point, CSS configuration and utility names.
The migration uses the upstream upgrade tool and the documented compatibility
changes: the existing theme lives in `@theme inline`, custom classes use
`@utility`, and shadow, outline, gradient, variable and related utility names are
updated in their consumers. The explicit 4px radius retains the old bare
`rounded` value without changing the project's separate zero-radius theme tokens.
Default ring, border, placeholder and button cursor behavior is retained.

The chart tooltip's locally supplied border color remains an explicit CSS color
variable; it must not collapse into the global `border-border` theme alias.
Fontsource styles load through the JavaScript module entry point so Vite resolves
and bundles their font assets before Tailwind's CSS import processing.

Tailwind 4's supported browser floor is **Safari 16.4+, Chrome 111+ and Firefox
128+**. This is a compatibility change for older browsers. CI uses Node 22.23.2;
React Router 7 and Playwright require Node 20 or newer.

## Runtime integration repairs found by browser verification

The starting application crashed before rendering when built without backend
credentials (`supabaseUrl is required`). Five workspace components imported the
generated strict Supabase client, bypassing the repository's documented local
fallback. They now import the existing shared client from `@/lib/supabase`.
Backend configuration, authentication behavior, database policies and the SDK
version are unchanged. The local fallback produces a controlled function error,
which Data Analysis handles by showing its calculated summary.

The workspace's Data Analysis branch imported `DataAnalysis` but rendered only
the older `AdvancedStatistics` example component. The real CSV implementation
from #17 is now mounted under **Data Analysis**. Existing illustrative statistics
remain in a collapsed section explicitly labeled as separate sample data. The
workspace header also uses the selected project's name instead of an unrelated
hardcoded title.

## Verification scope

The deterministic test suite contains 30 constructed numerical/import cases.
Five Chromium tests exercise the production build:

1. Login/signup links, browser history and the wildcard route render without
   initialization errors.
2. A project deep link opens real CSV analysis: values 10, 20 and 30 yield slope
   10, prediction 40, and a JSON export containing those rows, sum 60 and mean 20.
   An unavailable AI function produces the calculated local summary.
3. An invalid numeric token (`12kg`) preserves the sample rows and prediction
   6250; the separate statistics example remains explicitly identified.
4. Outfit and Bangers load from bundled assets. Compiled custom borders, zero
   radius, shadow geometry, scoped chart color, sidebar width and nested theme
   variables match their intended values.
5. A mobile form retains its visible focus ring and a 2px outline in forced-color
   mode.

The first migration build exposed unresolved relative font URLs; moving the font
imports fixed the build output and the browser font checks. The initial browser
test draft also assumed a shortened signup label and omitted Tailwind's inert
transparent shadow layers. Those assertions were corrected against the actual
UI and the previous compiled stylesheet. The previous input border is 1px and
is preserved; its visible focus ring and forced-color outline are checked
separately. These were test-authoring corrections, not changes that hid a failed
application behavior.

The baseline stylesheet was inspected in a static fixture because its original
application could not bootstrap without backend credentials. Candidate browser
tests run the actual application. The local Playwright browser CDN download was
truncated; local verification therefore used a separately installed Chromium
153.0.8010.0 executable with Playwright 1.64.0. CI installs Playwright's pinned
Chromium directly. No browser download workaround is added to repository CI.

Full cloud authentication, deployed Edge Functions and every product panel are
outside this focused check. The existing eight lint baseline errors and 19
warnings remain disclosed; the non-regression gate rejects new errors. The
existing large JavaScript chunk warning remains a build warning, with no limit
or gate weakened. These are product software checks and do not finish or change
any portfolio research study.

An independent source review covered the dependency graph, PostCSS configuration,
theme/utility conversion, font imports, shared-client wiring, workspace rendering
and the five browser tests. It found no blocking issue. The pull request records
the final local commands and the separate hosted CI result for its exact source.

## Upstream references

- [Tailwind CSS 4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- [React Router 6 to 7 upgrade guide](https://reactrouter.com/7.18.4/upgrading/v6)
- [React Router DOM compatibility exports](https://api.reactrouter.com/v7/modules/react-router-dom.html)
- [tailwind-merge supported Tailwind versions](https://github.com/dcastil/tailwind-merge)
- [shadcn Tailwind 4 integration](https://ui.shadcn.com/docs/tailwind-v4)
- [Playwright preview server configuration](https://playwright.dev/docs/test-webserver)
- [Supabase client initialization](https://supabase.com/docs/reference/javascript/initializing)
