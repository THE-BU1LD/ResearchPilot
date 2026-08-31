# Research Portfolio Sprint — 2026-08-31

## Objective
Turn the strongest existing research lines into auditable, reviewer-ready evidence rather than increasing project count. The portfolio should optimize for: reproducibility, falsifiability, external validation, and submission readiness.

## Promotion rule
A project moves toward arXiv/conference submission only when:
1. the hypothesis and falsification condition are frozen before new outcome access;
2. the headline evidence is multi-seed or otherwise appropriately replicated;
3. baselines and ablations are predeclared and comparable;
4. adverse/failed runs are retained;
5. tables/figures regenerate from canonical artifacts;
6. claims trace to exact commits/configs/results;
7. at least one skeptical outside reviewer or reproducer has inspected the work where feasible.

Negative, mixed, and falsified results remain scientifically useful when the protocol is strong. Do not rescue a narrative after seeing outcomes.

---

## Track A — LAM-JEPA: external validation + release closure

### Current role
Most mature candidate for a bounded arXiv technical report because the result is already frozen as negative/inconclusive and the repository has an external-validation packet.

### Next work
- Send a small first wave of personalized reproduction requests to qualified researchers already identified in the repository.
- Obtain at least 3 independent reports; archive successful and failed reproductions.
- Require validators to run the frozen scientific SHA rather than a moving branch.
- Add a compact discrepancy ledger: environment, command, observed metrics, deviations, verdict.
- Close authorship, affiliation, license, CITATION.cff, and immutable release/tag metadata truthfully.
- Re-run citation metadata audit and clean-environment reproduction after release metadata is frozen.
- Prepare an arXiv abstract whose main contribution is what the negative result teaches, not a claimed performance win.

### New deliverables
1. `VALIDATION/REPORT_INDEX.md`
2. `VALIDATION/DISCREPANCY_LEDGER.csv`
3. `paper/arxiv_main.tex`
4. `paper/claim_to_evidence.csv`
5. immutable release tag + reproduction receipt

### Kill/hold rule
Do not reopen the locked confirmatory ARC test or retune the historical failed line to improve the paper.

---

## Track B — Eigen-JEPA: provenance-first successor study

### Current role
Potentially strong finance/ML paper, but the five-seed final-rigor execution is currently blocked because the original seed-7 budget is not authoritatively reconstructable.

### Next work
- Search authoritative provenance only: old manifests, shell history artifacts, notebooks, CI logs, experiment configs, or archived commands.
- If exact non-seed parameters cannot be recovered, declare the historical seed-7 result non-combinable with new runs.
- Freeze a successor protocol and rerun **all five seeds from scratch**, including seed 7.
- Freeze source commit, data generation, chronological splits, architecture, optimizer, epochs, LR, context/horizon, batch size, masking, deterministic/device policy, variants, aggregation code, and gate version.
- Use the existing seed set `7, 19, 31, 43, 59` only if it remains the predeclared successor seed set before outcome access.
- Run full / no-memory / no-gate / no-regime with paired seeds and identical budgets.
- Generate paired effect sizes, uncertainty intervals, seed-level table, and failure/adverse-seed report.

### New deliverables
1. `protocols/final_rigor_v2.yaml`
2. `protocols/final_rigor_v2.sha256`
3. `results/final_rigor_v2/run_manifest.jsonl`
4. `results/final_rigor_v2/paired_statistics.csv`
5. `RIGOR_GATE_V2.md`
6. machine-generated paper table and figure scripts

### Hard rule
No robustness claim and no new outcome run until the provenance decision is closed.

---

## Track C — FI-JEPA: one canonical paper evidence line

### Current role
Promising finance representation-learning line, but overlapping historical result families create accidental cherry-picking risk.

### Next work
- Freeze one canonical benchmark config and one seed list before execution.
- Run every paper-facing row under the same splits, data budget, training budget, and evaluation code.
- Minimum paper matrix:
  - full
  - no EMA
  - no financial regularizers
  - no operator split
  - no uncertainty heads
  - no memory
  - deterministic control
  - reconstruction/control baseline
  - explicit downstream baseline
- Preserve all seeds, failures, and adverse baseline wins.
- Produce exactly one canonical `paper_results` artifact.
- Calculate paired comparisons and uncertainty, not only separate means.
- Re-test claims about EMA stabilization, latent organization, and downstream usefulness against the canonical aggregate.
- Mark all older result families historical/non-paper-facing.

### New deliverables
1. `protocols/paper_benchmark_v1.yaml`
2. `results/paper_results_v1.json`
3. `results/paper_results_v1.csv`
4. `results/paper_pairwise_v1.csv`
5. `paper/generated_results.tex`
6. `paper/evidence_lineage.md`

---

## Track D — NeuroCAD / VeriCodeGen: decisive successor benchmark

### Current role
The old typed-parser scientific claim remains falsified. The new structured-specification + deterministic compilation line should be treated as a separate successor study.

### Next work
- Keep the historical falsification visible and separate from new software/release work.
- Convert the current development smoke into a predeclared benchmark only after the comparison matrix is frozen.
- Freeze the minimum decisive matrix:
  1. naive direct generation baseline;
  2. strongest relevant classical/programmatic baseline;
  3. relevant neural/LLM baseline;
  4. strongest easy competitive baseline;
  5. NeuroCAD mechanism ablation;
  6. negative/control condition.
- Use one shared geometry verifier across arms.
- Predeclare topology/geometry validity metrics, task success metric, retry budget, generation budget, seed policy, and falsification criterion.
- Ensure all generated artifacts retain prompt/spec, model/version, seed, retry count, compiler version, verifier output, command, commit SHA, and timestamp.
- Add a one-command maintained experiment runner.
- Build a reviewer-facing status table separating release engineering from scientific validity.

### New deliverables
1. `protocols/vericodegen_v1.yaml`
2. `benchmarks/vericodegen/tasks_v1.jsonl`
3. `benchmarks/vericodegen/baseline_matrix.md`
4. `scripts/run_vericodegen_v1.*`
5. `results/vericodegen_v1/manifest.jsonl`
6. `docs/RESEARCH_STATUS_TABLE.md`
7. `paper/vericodegen_claim_ledger.csv`

---

## Cross-portfolio research work queue

### P0 — evidence integrity
- Build one machine-readable experiment manifest schema shared by all research repos.
- Add a claim-to-evidence table to every manuscript.
- Add fail-closed publication gates: manuscript cannot say `supported` unless canonical artifacts satisfy declared criteria.
- Record environment lockfiles/container hashes for every final run.
- Preserve negative runs and explicit failure reasons.

### P1 — statistical rigor
- Prefer paired seed comparisons where interventions share data/splits.
- Report per-seed outcomes, mean, SD, confidence intervals where defensible, and effect sizes.
- Predeclare primary metric; label all secondary/exploratory metrics.
- Add a sensitivity analysis that changes one plausible nuisance assumption at a time.
- Add calibration or error decomposition when the research claim depends on uncertainty/prediction quality.

### P1 — reviewer readiness
- 1-page paper card for every submission candidate: question, prior work, method, evidence, negative findings, limitations, reproducibility command.
- 2-minute reviewer status table: claim / evidence / verdict / next decisive test.
- Literature gap matrix with closest 10–20 papers and explicit novelty delta.
- Citation metadata audit against publisher/arXiv records.
- Clean-room reproduction from a fresh environment.

### P2 — external recognition
- Seek **reproduction/review**, not generic praise.
- Target researchers who are directly cited or methodologically adjacent.
- Keep outreach bounded and personalized.
- Archive reviewer comments and changes made in response.
- Convert credible external validation into an acknowledgments/reproducibility statement only with permission.

---

## Submission-candidate ranking

| Rank | Project | Current submission posture | Main blocker | Suggested arXiv family |
|---|---|---|---|---|
| 1 | LAM-JEPA | Closest to bounded technical report | external reproductions + release metadata | `cs.LG` likely |
| 2 | FI-JEPA | promising after canonical evidence consolidation | multi-seed canonical benchmark | `cs.LG` or quantitative-finance category depending manuscript emphasis |
| 3 | Eigen-JEPA | potentially strong but blocked | exact provenance or clean successor rerun | `cs.LG` / `q-fin.ST` / `q-fin.GN` depending final contribution |
| 4 | NeuroCAD / VeriCodeGen | successor protocol forming | decisive baseline matrix + real benchmark | `cs.CG`, `cs.LG`, or `cs.AI` depending core claim |

Category choice must follow the actual manuscript contribution, not branding.

---

## 72-hour execution sequence

### Phase 1 — Freeze
- Close Eigen-JEPA provenance decision.
- Freeze FI-JEPA benchmark config + seed list.
- Freeze VeriCodeGen baseline matrix and falsification rule.
- Freeze LAM-JEPA arXiv/reproduction release target.

### Phase 2 — Execute only authorized work
- FI-JEPA canonical runs.
- Eigen-JEPA successor runs only if provenance protocol is valid and frozen.
- NeuroCAD benchmark plumbing + dry runs; do not open main outcomes before protocol freeze.
- LAM-JEPA external reproduction wave.

### Phase 3 — Convert evidence into paper artifacts
- regenerate tables/figures directly from canonical outputs;
- run claim audits;
- update limitation sections;
- build clean PDFs;
- produce reviewer packets;
- start arXiv submission flow for the first genuinely ready manuscript.

## Definition of a win
A smaller number of defensible papers with clean provenance, honest negative results, and independent scrutiny is a much stronger research portfolio than a larger number of unverified positive claims.