# Public Claims Policy

Research Muse public copy must distinguish **implemented capability**, **observed product evidence**, and **aspirational/product-hypothesis language**.

## Allowed without a separate evidence receipt

Public copy may describe behavior that is directly inspectable in the current product or repository, for example:

- a project workspace exists;
- a literature/source workflow exists;
- methodology, analysis, writing, integrity, ethics, and export surfaces exist;
- local demo mode is available when Supabase is not configured;
- a specific control or test passes on an exact revision when the receipt is linked.

The wording should describe what the software does, not what users supposedly achieved because of it.

## Requires retained evidence before publication

Do not publish any of the following unless the repository or operating ledger contains a source/evidence receipt that can be reviewed:

- user/member/student/project counts;
- country/reach counts;
- ratings or satisfaction percentages;
- completion, retention, time-saved, or outcome-improvement percentages;
- named testimonials or success stories;
- competition/publication/admission outcomes attributed to the product;
- founder credentials used as product proof;
- market/global-access statistics;
- pricing/program-cost statistics;
- claims that the product is "trusted", "proven", "used worldwide", or equivalent.

A source URL alone is not automatically enough for a product-performance claim. Record the claim, population/time window, source, interpretation, and any limitations.

## Testimonials

Testimonials require:
1. a real identified source;
2. permission to publish the quote/name or an explicitly approved anonymized form;
3. the exact quote or a marked paraphrase;
4. date/context;
5. no invented achievement or location metadata.

Synthetic personas must be labeled as examples and must not appear under headings such as "Real Voices", "Success Stories", or "Researchers Love Us".

## Product pilots and metrics

Before adding public adoption/outcome numbers, retain a small metric receipt:

```text
claim:
metric_definition:
population:
time_window:
data_source:
deduplication_rule:
calculation:
known_missingness:
owner:
verified_at:
artifact/link:
public_wording:
```

If the receipt cannot be reconstructed, use qualitative capability language instead.

## CI boundary

`scripts/ci/public-claims.mjs` blocks a small set of previously published unsupported claims and prevents claim-heavy legacy sections from being re-enabled on the landing page accidentally.

It is not a substitute for human review. New claims can be unsupported without matching one of the blocked strings.
