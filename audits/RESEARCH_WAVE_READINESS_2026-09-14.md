# Research wave readiness audit — 2026-09-14

**Audit rule:** a project is marked GREEN only when the relevant exact source/evidence head has actually passed its declared verification gate, or when the change is documentation/protocol-only and no workflow is declared for that path. A job that never starts is an infrastructure blocker, not a code failure. A collaborator repository without push permission is an ownership blocker, not an invitation to copy the work into a different project. Frozen negative/null evidence is never rewritten to manufacture green status.

## Executive state

| Lane | Canonical surface | State after audit | Exact next gate |
|---|---|---|---|
| NGMT code integrity | `THE-BU1LD/NGMT` PR #16 | CODE HARDENED / ACTIONS ADMISSION BLOCKED | restore normal GitHub Actions execution, then rerun unchanged head |
| NGMT retained matrix / paper binding | `THE-BU1LD/NGMT` PR #18 | REVIEW READY | review single current-main evidence-binding commit |
| LAM-JEPA | `vertex-studyAI/LAM-JEPA` PR #175 | EXACT-HEAD GREEN / CURRENT-MAIN RESTACK AUTHORITY BLOCKED | authorize paper-only restack without opening bounded scientific execution |
| APEN | `THE-BU1LD/APEN-Synthica` PR #14 | EVIDENCE-LOCKED / ACTIONS ADMISSION BLOCKED | restore runner execution; keep source-hash-bound result unchanged |
| Assumption-Integrity | `THE-BU1LD/Assumption-Integrity` PR #16 | CODE HARDENED / ACTIONS ADMISSION BLOCKED | restore Actions execution, rerun unchanged verification head |
| NeuroCAD | `THE-BU1LD/NeuroCAD` PR #55 | VALIDATION PROTOCOL FROZEN / REVIEW READY | external challenge/comparator/leakage receipts before any confirmatory outcome access |
| Pantheon | `THE-BU1LD/Olympus-Pantheon` PR #8 | EXACT-HEAD GREEN / REVIEW GATED | human review of evidence-fingerprint semantics |
| Olympus cognitive architecture | `build-the-future-11/olympus-cognitive-architecture` PR #6 | EXACT-HEAD GREEN / REVIEW GATED | human review of pinned HTTPS/TLS transport |
| STELLAR/JEPA collaborator lane | `AbhinandanMandal/STELLAR` | AUDITED / NO PUSH PERMISSION | collaborator must freeze corrected rank-selection protocol before confirmation |
| RouteIQ collaborator lane | `nagajaideep/NLP-BASED-QUERY-ROUTING-ENGINE` | FROZEN AUDIT CLOSED / NO PUSH PERMISSION | no rescue tuning; any successor requires a new prospective protocol |
| XAI_Forensic / Parshvi calibration | `parshvi1508/XAI_Forensic` | PRE-OUTCOME PAUSED / NO PUSH PERMISSION | independent labels or removal/reframing of circular calibration claim |
| Space-JEPA | historical freeze in `vertex-studyAI/vertexED.ai` PR #740 | PROTOCOL FROZEN / NO CANONICAL RESEARCH REPO | assign allowed canonical research surface; do not weaken VertexED scope CI |
| NPMS identity | conflicting current queue vs canonical project identity | IDENTITY UNRESOLVED | locate the source bundle for the Sep-13 “Non-Parametric Memory Subspaces” paper before any repo mutation |
| Transfinite / VTOL / liability / clean-energy exploratory labels | no canonical mounted repo found in this audit | NOT CODE-ADDRESSABLE | map each label to an owned canonical repo/source before implementation |

## Changes committed in this audit

### NGMT — cache integrity

Branch: `fix/issue-14-cache-fingerprint`

- `03eb82096ea6f9e399302ec813ee554b7d8468f6` — bind experiment caches to maintained implementation source and numerical runtime versions.
- `d862a697ef0b8792ce9b443e6a6623dd49e313ea` — add source/runtime cache-invalidation regression tests.

The cache fingerprint now fails closed when maintained experiment code or relevant numerical runtime versions change, preventing scientifically stale outputs from being silently reused under unchanged YAML/config inputs.

GitHub Actions still fails before workflow steps execute on the affected private THE-BU1LD lanes. This audit does not weaken or remove the workflow to manufacture a badge.

### NGMT — retained full-matrix evidence binding

Current-main branch: `paper/import-retained-full-matrix-current-main-20260914`

Commit: `8a0f51eda78d894eb96c162a4e34afea058ff829`

PR: #18

This single documentation-only commit binds the paper lane to retained workflow run `34271260906`, the frozen run head `d7869ad8d0ad78edd9761e9b41cdd5b01617e69e`, the retained publication artifact, the actual five-dataset matrix (`ETTh1`, `ETTh2`, `ETTm1`, `Exchange`, `Weather`), pooled pairwise intervals, ranks, and generated-file hashes. It explicitly prevents intervals crossing zero from being reported as established natural-data wins.

The first restack attempt (PR #17) was closed before review because it was rooted at the frozen run head and carried stale historical commits relative to current `main`; no scientific evidence was changed.

### Assumption-Integrity — fail-closed frozen-evidence verification

Branch: `repro/canonical-verification-20260909`

- `ed2a6b73a2a8d9ffda4c2eabd7b7ec554dca3031` — reject non-finite frozen values and duplicate/malformed evidence keys.
- `6a55219f75f96c3eaeeaeca91d8bc1ad6874db91` — regression tests for NaN/Inf/duplicate-key failures.
- `9f7324c91f7d1dc1b6b7cc1480a6fcc932a5ae81` — execute the fail-closed verifier tests in canonical reproduction CI.

Scientific values and claim boundaries were not changed.

### NeuroCAD — independent validation gate

Branch: `research/independent-validation-gate-20260914`

Commit: `41e632cc39097e5d97a44f0159a7188796d0b63a`

PR: #55

The new pre-outcome gate freezes:

- exact treatment source/environment/OpenSCAD provenance;
- independently authored challenge provenance/hash/adjudication;
- comparator fairness or explicit claim narrowing;
- one prospectively declared primary endpoint and failure accounting;
- component interventions as separate mechanism analyses;
- leakage/independence review;
- outcome-access state transitions and stop conditions;
- the retained evidence package required before reporting.

The historical typed-parser mechanism claim remains falsified; this protocol does not revive it and does not authorize VeriCodeGen outcome runs.

## Projects deliberately not modified

### Pantheon

PR #8 is mergeable and its exact head `e9d643612d1a27bd9a907e9ab3df9fe33dd70aaa` already passed Pantheon Reproducibility run `34036688077`. The remaining gate is normal review because the PR changes evidence-equivalence semantics. No additional churn was warranted.

### Olympus cognitive architecture

PR #6 is mergeable and exact head `3fec808f1e12dd5cb8ad5bf3c1b8c3bf4899a30c` passed release-gate run `34055350397`. The remaining gate is human review of the security-sensitive HTTPS pinning/TLS path. No scientific change is involved.

### LAM-JEPA

PR #175 head `0c428bcb57346b4929f24e837f00ee1f5f880d9b` passed all six triggered exact-head workflows. Canonical `main` later advanced. The PR itself records that an automatic restack would retrigger workflows containing bounded model/data execution; therefore this audit does not cross that scientific-execution authority boundary merely to refresh the merge base.

### APEN

The current conference evidence branch is deliberately source/evidence bound. The conference draft already contains complete bibliography entries for its cited FNO, DeepONet, and PDEBench references; the later queue statement about visible citation placeholders is stale for this head.

A semantic inconsistency in historical recurrence-style memory diagnostics was observed during implementation review, but mutating the evidence-bearing source after results were bound would invalidate the current reproduction lane. Any recurrence redesign belongs on a separately versioned post-evidence experiment, not inside PR #14.

## Collaborator/ownership blockers

### STELLAR

Connected GitHub access is read-only for `AbhinandanMandal/STELLAR`. The written selection rule chooses the *smallest* rank within 1% of dense validation performance. The inspected retained values show rank 32 already qualifies, so a held-out rank-64 cycle cannot be promoted as a prospective confirmation under that written rule. The collaborator should freeze whether “1%” is absolute or relative and the tie/selection rule before a new confirmatory cycle.

### RouteIQ

Connected access to `nagajaideep/NLP-BASED-QUERY-ROUTING-ENGINE` is read-only. The canonical frozen audit is closed: the stronger neural route model did not clear the predeclared material-gain threshold over the lexical baseline. This lane should remain closed rather than receive rescue tuning on the same held-out evidence.

### XAI_Forensic / Parshvi

Connected access to `parshvi1508/XAI_Forensic` is read-only. The pre-outcome audit found that ECE/Brier-style “calibration” computed against the model's own predicted class is circular and cannot validate calibration. Stage 3 should remain paused until independent labels/targets are supplied or the calibration claim is removed/reframed. No outcome-bearing run is authorized by this audit.

## Space-JEPA routing boundary

The historically frozen PLAsTiCC decision rule is retained in `vertex-studyAI/vertexED.ai` PR #740 and must stay frozen. Later VertexED scope verification correctly rejects `portfolio/research/space-jepa` because that product repository is not the allowed canonical research surface. The existing routing state is effectively `HOLD_NO_CANONICAL_REPO`.

Do not make this green by weakening the VertexED scope classifier. The next legitimate action is to provision/identify the canonical research repository and carry the frozen protocol/representation-health work there with source provenance intact.

## NPMS identity collision

There are at least two incompatible NPMS identities in retained portfolio material:

1. canonical Project-2424 / `THE-BU1LD/NPMS`: **Neural Predictive Memory Spectroscopy**, an intervention-oriented memory-failure diagnostic;
2. the Sep-13 conference-readiness packet: **Non-Parametric Memory Subspaces for Long-Horizon Time-Series Forecasting**, described with PatchTST, four stress regimes, negative subspace controls, and C-MAPSS.

Earlier canonical identity reconciliation explicitly locks the Project-2424 name to Neural Predictive Memory Spectroscopy. No owned repository/source bundle for the Sep-13 forecasting identity was found in the connected GitHub/Drive search performed in this audit. Therefore `THE-BU1LD/NPMS` must not be overwritten with the forecasting project. Source identity must be recovered first.

## Actions/runner blocker classification

NGMT, APEN-Synthica, and Assumption-Integrity repeatedly show jobs failing within a few seconds before any workflow step starts. Inspected Actions jobs have no executed steps/runner assignment for the affected runs. GitHub notification emails expose the failure but do not provide a repository-code stack trace or a confirmed billing/policy diagnosis.

Therefore:

- do not weaken tests, remove workflows, or alter scientific code merely to clear the dashboard;
- do not classify these failures as scientific-test failures;
- restore normal Actions job admission at the organization/repository layer, then rerun the unchanged exact heads;
- only after a job actually starts should a new code failure be diagnosed from logs.

## Definition of “ready” used by this audit

A research lane is ready for the next human/scientific step when all applicable items below hold:

1. canonical project identity and repository are unambiguous;
2. exact source head is named;
3. frozen evidence is not silently regenerated or rescued;
4. code-level blockers found in audit have a committed fix and regression test;
5. CI has actually executed and passed, or the lane is explicitly classified as infrastructure/permission/protocol blocked;
6. held-out/outcome access remains behind the frozen authorization boundary;
7. manuscript claims match the retained evidence, including negative/null/mixed results;
8. no cross-project source is copied merely to make a dashboard appear complete.

Anything else remains non-green by design.
