# Space-JEPA canonical migration gate — 2026-09-14

## Status

`HOLD_NO_CANONICAL_REPO`

This note pins the smallest defensible correction for the current Space-JEPA engineering-verification failure without changing any frozen scientific protocol, inspecting held-out outcomes, or weakening VertexED product CI.

## First causal break

The current-main carry of the pre-outcome ESA label guard (`vertex-studyAI/vertexED.ai` PR #823, exact head `f69be69c4cf9b5db78776819a99c9721653eb024`) reached the canonical VertexED release gate successfully through checkout, exact-source binding, dependency installation, linting, typecheck, and the application test suite. The run executed 701 tests: 700 passed and exactly one failed.

The sole failure was the product scope classifier:

```text
Subtest: unrelated research and generated public apps stay outside VertexED
portfolio/research/space-jepa must remain outside this product
true !== false
```

Therefore the first causal break is **repository placement**, not a demonstrated Space-JEPA algorithm, guard, parser, metric, or representation-diagnostics defect. The VertexED scope test is behaving as intended and must not be weakened or deleted to make research CI green.

## Frozen provenance that must survive migration

| Surface | Source PR | Exact source head | Merge state | Scientific role |
|---|---:|---|---|---|
| PLAsTiCC primary decision rule | #740 | `5b6cd8d9d7d3fcb44b3b577c52eda8ed7e765a6e` | merged as `ea3cf296aa52c03f7386ca63e687b1a1a326e7f8` | primary confirmatory freeze |
| ESA-ADB integration contract | #746 | `c55dcb6a05d109937eda519fb412293573c676a8` | merged as `7e3d6409205f137097d2758cb1645931bbf6f2bd` | second independent endpoint integration |
| ESA endpoint + latency rule | #751 | `751a788875825e4a6f24ed19be535901d755fac1` | merged as `64ad1d998ef54306814718e679ffe5071cb9f9bb` | confirmatory endpoint/latency freeze |
| ESA pre-outcome label guard carry | #823 | `f69be69c4cf9b5db78776819a99c9721653eb024` | closed, unmerged | current-main safety carry |
| PLAsTiCC train-only representation audit carry | #824 | `552dc17b761b3801c12f71e348691347459d9265` | closed, unmerged | representation-health carry |

## Scientific invariants — do not edit during routing

### PLAsTiCC

- comparison: time-aware JEPA vs same-capacity time-agnostic JEPA only
- primary metric: class-balanced multiclass log loss
- effect orientation: `loss_time_agnostic - loss_time_aware`
- practical threshold: `+0.02`
- seeds: `[11, 23, 37, 53, 71]`
- seed consistency: at least `4/5` positive deltas
- paired hierarchical bootstrap: `10,000` replicates, seed `20260906`, within-class object resampling plus seed resampling
- CI gate: 95% lower bound must exceed `0`
- macro AP/AUROC remain descriptive only and cannot rescue the primary endpoint

### ESA-ADB

- Mission 1 confirmatory endpoint: `cps_1`; `cps` remains secondary
- latency comparison: reciprocal endpoint latency, candidate-minus-comparator orientation
- practical gate: at least `25 ms` advantage
- CI gate: 95% paired hierarchical-bootstrap interval entirely below `-25 ms`
- seed consistency: at least `4/5` seed deltas below `-25 ms`
- bootstrap: `10,000` replicates, seed `20260908`
- ambiguous or unavailable derived latency must fail closed; no best-effort substitution

### Authorization boundary

Migration is infrastructure work only. It does **not** authorize held-out-label access, outcome generation, confirmatory experiment execution, endpoint substitution, seed changes, threshold changes, or retrospective protocol repair.

## Smallest correction

1. Assign an explicit canonical Space-JEPA research repository/surface outside VertexED.
2. Carry the frozen protocol and current safety/representation work from the exact source revisions above, retaining source PR/head provenance in the destination.
3. Run Space-JEPA-specific tests and workflow gates in that canonical research surface.
4. Require exact-head green evidence there before treating the old VertexED research carries as superseded.
5. Leave `tests/test-scope-classification.test.mjs` and the VertexED research-exclusion contract unchanged.

## Migration acceptance gate

A migration is accepted only when all of the following are true:

- canonical owner/repository is explicit, not inferred;
- destination files are source-bound to the exact revisions above or differences are individually justified as non-scientific routing changes;
- frozen PLAsTiCC and ESA values above match exactly;
- representation-health gates remain present;
- pre-outcome label guard remains present;
- no held-out outcomes were accessed to complete the move;
- destination exact-head research CI is green;
- VertexED remains green without reintroducing `portfolio/research/space-jepa` into the product tree.

Until then, state remains `HOLD_NO_CANONICAL_REPO`.