"""BU1LD 64 — autonomous science batch v0.

Deterministic incubation baselines only. These functions are not research-result claims.
"""
from collections import Counter, defaultdict, deque
import math
import re

def compile_experiment_dag(nodes, dependencies):
    nodes=list(dict.fromkeys(nodes))
    graph=defaultdict(list); indeg={n:0 for n in nodes}
    for before, after in dependencies:
        if before not in indeg or after not in indeg:
            raise ValueError("dependency references unknown node")
        graph[before].append(after); indeg[after]+=1
    q=deque([n for n in nodes if indeg[n]==0]); order=[]
    while q:
        n=q.popleft(); order.append(n)
        for m in graph[n]:
            indeg[m]-=1
            if indeg[m]==0: q.append(m)
    if len(order)!=len(nodes): raise ValueError("cycle detected")
    return {"nodes":nodes,"dependencies":[list(x) for x in dependencies],"execution_order":order}

def route_scientific_tool(tools, task_requirements=None):
    if not tools: raise ValueError("no tools")
    req=set(task_requirements or []); scored=[]
    for t in tools:
        caps=set(t.get("capabilities",[]))
        coverage=(len(req & caps)/len(req)) if req else 1.0
        calibration=float(t.get("calibration",0.0))
        provenance=float(t.get("provenance",0.0))
        failure=float(t.get("recent_failure_rate",0.0))
        score=0.45*calibration+0.30*provenance+0.25*coverage-0.35*failure
        scored.append((score,t["name"]))
    scored.sort(reverse=True)
    return {"selected":scored[0][1],"ranking":[{"name":n,"score":s} for s,n in scored]}

def choose_discriminating_experiment(claims, experiments):
    if len(claims)<2: raise ValueError("need at least two claims")
    best=None
    for exp in experiments:
        preds=exp.get("predictions",{})
        vals=[float(preds[c]) for c in claims if c in preds]
        if len(vals)!=len(claims): continue
        mean=sum(vals)/len(vals)
        disagreement=sum((v-mean)**2 for v in vals)/len(vals)
        cost=max(float(exp.get("cost",1.0)),1e-9)
        cand={"name":exp["name"],"score":disagreement/cost,"disagreement":disagreement,"cost":cost}
        if best is None or cand["score"]>best["score"]: best=cand
    if best is None: raise ValueError("no fully specified experiment")
    return best

def score_replications(target_metrics, replicas, tolerance=0.05):
    out=[]
    for rep in replicas:
        errs=[]
        for k,v in target_metrics.items():
            if k not in rep.get("metrics",{}): continue
            denom=max(abs(float(v)),1e-9)
            errs.append(abs(float(rep["metrics"][k])-float(v))/denom)
        mean_err=sum(errs)/len(errs) if errs else float("inf")
        out.append({"name":rep["name"],"mean_relative_error":mean_err,"passes":mean_err<=tolerance})
    return sorted(out,key=lambda x:x["mean_relative_error"])

def _tokens(s): return re.findall(r"[a-z0-9]+",s.lower())
def _cos(a,b):
    ca,cb=Counter(_tokens(a)),Counter(_tokens(b)); keys=set(ca)|set(cb)
    dot=sum(ca[k]*cb[k] for k in keys)
    na=math.sqrt(sum(v*v for v in ca.values())); nb=math.sqrt(sum(v*v for v in cb.values()))
    return dot/(na*nb) if na and nb else 0.0

def curate_negative_results(query, negative_results, top_k=3):
    ranked=[]
    for r in negative_results:
        text=" ".join(str(r.get(k,"")) for k in ("title","hypothesis","failure","notes"))
        ranked.append({"score":_cos(query,text),**r})
    return sorted(ranked,key=lambda x:x["score"],reverse=True)[:top_k]

def rank_baselines(requirements, candidates):
    req=set(requirements); rows=[]
    for c in candidates:
        tags=set(c.get("tags",[]))
        coverage=len(req & tags)/len(req) if req else 1.0
        reproducible=1.0 if c.get("reproducible",False) else 0.0
        license_ok=1.0 if c.get("license_ok",False) else 0.0
        recency=float(c.get("maintenance",0.0))
        score=.45*coverage+.25*reproducible+.20*license_ok+.10*recency
        rows.append({"name":c["name"],"score":score,"coverage":coverage})
    return sorted(rows,key=lambda x:x["score"],reverse=True)

def should_continue(expected_information_gain, experiment_cost, risk_penalty=0.0, threshold=0.0):
    utility=float(expected_information_gain)-float(experiment_cost)-float(risk_penalty)
    return {"continue":utility>threshold,"utility":utility,"threshold":threshold}

def plan_rebuttal_experiments(objections, experiments, budget):
    remaining=float(budget); chosen=[]; covered=set(); scored=[]
    for e in experiments:
        cov=set(e.get("addresses",[])) & set(objections)
        value=float(e.get("value",1.0))*len(cov)
        cost=max(float(e.get("cost",1.0)),1e-9)
        scored.append((value/cost,value,cost,e,cov))
    for ratio,value,cost,e,cov in sorted(scored,reverse=True,key=lambda x:x[0]):
        new=cov-covered
        if cost<=remaining and new:
            chosen.append(e["name"]); covered|=new; remaining-=cost
    return {"chosen":chosen,"covered":sorted(covered),"uncovered":sorted(set(objections)-covered),"remaining_budget":remaining}
