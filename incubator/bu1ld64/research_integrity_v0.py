"""BU1LD 64 — research-integrity batch v0.

Deterministic incubation utilities only. These functions produce review aids,
not scientific verdicts.
"""
from __future__ import annotations

from collections import Counter
import hashlib
import json
import math
import re


def _tokens(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _cosine(a: str, b: str) -> float:
    ca, cb = Counter(_tokens(a)), Counter(_tokens(b))
    keys = set(ca) | set(cb)
    dot = sum(ca[k] * cb[k] for k in keys)
    na = math.sqrt(sum(v * v for v in ca.values()))
    nb = math.sqrt(sum(v * v for v in cb.values()))
    return dot / (na * nb) if na and nb else 0.0


def audit_claim_evidence(claims, evidence):
    """Map each claim to explicit supporting evidence and flag unsupported claims."""
    rows = []
    evidence_by_id = {e["id"]: e for e in evidence}
    for claim in claims:
        ids = [i for i in claim.get("evidence_ids", []) if i in evidence_by_id]
        rows.append({
            "claim_id": claim["id"],
            "supported": bool(ids),
            "evidence_ids": ids,
            "missing_ids": [i for i in claim.get("evidence_ids", []) if i not in evidence_by_id],
        })
    return rows


def detect_reproducibility_drift(reference, candidate):
    """Compare frozen run metadata against a candidate rerun."""
    keys = ("commit", "config_hash", "data_hash", "seed", "environment_hash")
    changes = {k: (reference.get(k), candidate.get(k)) for k in keys if reference.get(k) != candidate.get(k)}
    return {"drift": bool(changes), "changes": changes}


def check_result_consistency(reported, artifacts, atol=1e-9):
    """Check reported scalar results against machine-readable artifact values."""
    mismatches = []
    for key, value in reported.items():
        if key not in artifacts:
            mismatches.append({"key": key, "reason": "missing_artifact_value"})
            continue
        try:
            delta = abs(float(value) - float(artifacts[key]))
        except (TypeError, ValueError):
            delta = 0.0 if value == artifacts[key] else float("inf")
        if delta > atol:
            mismatches.append({"key": key, "reported": value, "artifact": artifacts[key], "delta": delta})
    return {"consistent": not mismatches, "mismatches": mismatches}


def audit_figure_manifest(figures, artifact_hashes):
    """Verify that figure entries point to retained, hash-matching artifacts."""
    problems = []
    for fig in figures:
        source = fig.get("source")
        expected = fig.get("sha256")
        actual = artifact_hashes.get(source)
        if source not in artifact_hashes:
            problems.append({"figure": fig.get("id"), "reason": "missing_source"})
        elif expected and expected != actual:
            problems.append({"figure": fig.get("id"), "reason": "hash_mismatch"})
    return {"valid": not problems, "problems": problems}


def stress_test_novelty_claim(claim_text, prior_work, similarity_threshold=0.75):
    """Surface highly similar prior-work descriptions for human novelty review."""
    hits = []
    for item in prior_work:
        score = _cosine(claim_text, item.get("description", ""))
        if score >= similarity_threshold:
            hits.append({"id": item["id"], "similarity": score})
    hits.sort(key=lambda x: x["similarity"], reverse=True)
    return {"needs_review": bool(hits), "hits": hits}


def detect_split_leakage(train_ids, test_ids, groups=None):
    """Detect exact ID overlap and optional group overlap across splits."""
    train, test = set(train_ids), set(test_ids)
    exact = sorted(train & test)
    group_overlap = []
    if groups:
        train_groups = {groups[i] for i in train if i in groups}
        test_groups = {groups[i] for i in test if i in groups}
        group_overlap = sorted(train_groups & test_groups)
    return {"leakage": bool(exact or group_overlap), "exact_overlap": exact, "group_overlap": group_overlap}


def check_public_claim_boundary(public_claims, evidence_status):
    """Flag public claims whose required evidence is not in a verified state."""
    violations = []
    for claim in public_claims:
        required = claim.get("requires", [])
        bad = [r for r in required if evidence_status.get(r) != "verified"]
        if bad:
            violations.append({"claim_id": claim["id"], "unverified_requirements": bad})
    return {"safe": not violations, "violations": violations}


def build_counterexample_provenance_graph(counterexamples):
    """Create a deterministic provenance graph and content hash for counterexamples."""
    nodes, edges = [], []
    for c in counterexamples:
        cid = c["id"]
        nodes.append({
            "id": cid,
            "claim_id": c.get("claim_id"),
            "artifact": c.get("artifact"),
            "status": c.get("status", "retained"),
        })
        if c.get("claim_id"):
            edges.append({"from": cid, "to": c["claim_id"], "type": "tests"})
        if c.get("source_id"):
            edges.append({"from": c["source_id"], "to": cid, "type": "produced"})
    payload = {"nodes": sorted(nodes, key=lambda x: x["id"]), "edges": sorted(edges, key=lambda x: (x["from"], x["to"], x["type"]))}
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
    return {**payload, "sha256": digest}
