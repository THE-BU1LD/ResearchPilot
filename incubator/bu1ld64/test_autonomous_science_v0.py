import pytest
from incubator.bu1ld64.autonomous_science_v0 import (
    compile_experiment_dag, route_scientific_tool, choose_discriminating_experiment,
    score_replications, curate_negative_results, rank_baselines, should_continue,
    plan_rebuttal_experiments,
)

def test_dependency_compiler():
    out=compile_experiment_dag(["measure","fit","test"],[("measure","fit"),("fit","test")])
    assert out["execution_order"]==["measure","fit","test"]

def test_dependency_cycle():
    with pytest.raises(ValueError):
        compile_experiment_dag(["a","b"],[("a","b"),("b","a")])

def test_tool_router():
    tools=[{"name":"a","calibration":.9,"provenance":.9,"capabilities":["python"],"recent_failure_rate":0},
           {"name":"b","calibration":.7,"provenance":.6,"capabilities":["python"],"recent_failure_rate":.1}]
    assert route_scientific_tool(tools,["python"])["selected"]=="a"

def test_experiment_compiler():
    claims=["A","B"]
    exps=[{"name":"weak","cost":1,"predictions":{"A":.5,"B":.55}},
          {"name":"split","cost":1,"predictions":{"A":.1,"B":.9}}]
    assert choose_discriminating_experiment(claims,exps)["name"]=="split"

def test_replication_tournament():
    r=score_replications({"acc":.8},[{"name":"good","metrics":{"acc":.79}},{"name":"bad","metrics":{"acc":.6}}],.05)
    assert r[0]["name"]=="good" and r[0]["passes"]

def test_negative_curator():
    rows=[{"title":"PDE operator failed under shocks","failure":"shock discontinuity"},
          {"title":"vision classifier","failure":"label noise"}]
    assert curate_negative_results("PDE shock failure",rows,1)[0]["title"].startswith("PDE")

def test_baseline_archaeologist():
    c=[{"name":"good","tags":["pde","operator"],"reproducible":True,"license_ok":True,"maintenance":.8},
       {"name":"weak","tags":["pde"],"reproducible":False,"license_ok":True,"maintenance":.2}]
    assert rank_baselines(["pde","operator"],c)[0]["name"]=="good"

def test_stopping_rule():
    assert should_continue(1.0,.2)["continue"]
    assert not should_continue(.1,.5)["continue"]

def test_rebuttal_planner():
    out=plan_rebuttal_experiments(["baseline","ablation"],
        [{"name":"cheap","addresses":["baseline"],"cost":1,"value":2},
         {"name":"ablate","addresses":["ablation"],"cost":1,"value":2}],2)
    assert set(out["covered"])=={"baseline","ablation"}
