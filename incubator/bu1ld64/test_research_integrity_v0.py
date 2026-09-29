from incubator.bu1ld64.research_integrity_v0 import (
    audit_claim_evidence,
    detect_reproducibility_drift,
    check_result_consistency,
    audit_figure_manifest,
    stress_test_novelty_claim,
    detect_split_leakage,
    check_public_claim_boundary,
    build_counterexample_provenance_graph,
)


def test_claim_evidence_auditor_flags_missing():
    out = audit_claim_evidence(
        [{"id": "c1", "evidence_ids": ["e1", "e2"]}],
        [{"id": "e1"}],
    )
    assert out[0]["supported"]
    assert out[0]["missing_ids"] == ["e2"]


def test_reproducibility_drift():
    ref = {"commit": "a", "config_hash": "x", "data_hash": "d", "seed": 1, "environment_hash": "e"}
    cand = {**ref, "seed": 2}
    out = detect_reproducibility_drift(ref, cand)
    assert out["drift"] and out["changes"]["seed"] == (1, 2)


def test_result_consistency():
    assert check_result_consistency({"mse": 0.2}, {"mse": 0.2})["consistent"]
    assert not check_result_consistency({"mse": 0.2}, {"mse": 0.3})["consistent"]


def test_figure_manifest():
    out = audit_figure_manifest(
        [{"id": "f1", "source": "a.csv", "sha256": "abc"}],
        {"a.csv": "abc"},
    )
    assert out["valid"]


def test_novelty_stress():
    prior = [{"id": "p1", "description": "causal memory retrieval boundary test"}]
    out = stress_test_novelty_claim("causal memory retrieval boundary test", prior, 0.7)
    assert out["needs_review"] and out["hits"][0]["id"] == "p1"


def test_split_leakage_exact_and_group():
    groups = {"a": "g1", "b": "g2", "c": "g1"}
    out = detect_split_leakage(["a", "b"], ["b", "c"], groups)
    assert out["leakage"]
    assert out["exact_overlap"] == ["b"]
    assert out["group_overlap"] == ["g1", "g2"]


def test_public_claim_boundary():
    out = check_public_claim_boundary(
        [{"id": "c", "requires": ["r1", "r2"]}],
        {"r1": "verified", "r2": "planned"},
    )
    assert not out["safe"]
    assert out["violations"][0]["unverified_requirements"] == ["r2"]


def test_counterexample_graph_is_deterministic():
    rows = [
        {"id": "x2", "claim_id": "c1", "artifact": "b.json"},
        {"id": "x1", "claim_id": "c1", "artifact": "a.json", "source_id": "run1"},
    ]
    a = build_counterexample_provenance_graph(rows)
    b = build_counterexample_provenance_graph(list(reversed(rows)))
    assert a["sha256"] == b["sha256"]
    assert [n["id"] for n in a["nodes"]] == ["x1", "x2"]
