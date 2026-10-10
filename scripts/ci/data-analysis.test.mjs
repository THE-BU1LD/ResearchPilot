import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../../src/lib/data-analysis.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const {
  parseAnalysisCSV, summarizeRows, fitRowTrend, analyzeRows, descriptiveInsights,
  MAX_ANALYSIS_ROWS, MAX_ANALYSIS_BYTES,
} = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const rows = values => values.map((value, i) => ({ category: `case ${i + 1}`, value, growth: i, target: 2 }));
const close = (actual, expected, tolerance = 1e-12) => assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);

test("CSV preserves quoted commas, escaped quotes, CRLF and embedded newlines", () => {
  const parsed = parseAnalysisCSV('\uFEFFcategory,value,growth,target,note\r\n"first, group",1.5e2,-2,140,"a ""quote"""\r\n"second\nline",.5,+3,0,plain\r\n');
  assert.deepEqual(parsed, [
    { category: "first, group", value: 150, growth: -2, target: 140, note: 'a "quote"' },
    { category: "second\nline", value: 0.5, growth: 3, target: 0, note: "plain" },
  ]);
});

for (const value of ["", "12kg", "Infinity", "NaN", "0x20", "1e309", "2.3.4", "1,000"]) {
  test(`CSV rejects an incomplete or nonfinite numeric field: ${JSON.stringify(value)}`, () => {
    assert.throws(() => parseAnalysisCSV(`category,value,growth,target\na,"${value}",0,1\n`), /complete finite number/);
  });
}

for (const malformed of [
  "category,value,growth\na,1,2", "category,value,value,target\na,1,2,3",
  "category,value,growth,target\na,1,2", "category,value,growth,target\na,1,2,3,4",
  'category,value,growth,target\n"unfinished,1,2,3',
  'category,value,growth,target\n"closed"junk,1,2,3',
  'category,value,growth,target\nunquoted"quote,1,2,3',
  "category,value,growth,target\n,1,2,3", "category,value,growth,target\n",
]) {
  test(`CSV rejects malformed structure: ${JSON.stringify(malformed)}`, () => {
    assert.throws(() => parseAnalysisCSV(malformed));
  });
}

test("CSV bounds cover both row count and UTF-8 bytes", () => {
  assert.throws(() => parseAnalysisCSV("category,value,growth,target\n" + "x,1,2,3\n".repeat(MAX_ANALYSIS_ROWS + 1)), /10,000/);
  assert.throws(() => parseAnalysisCSV("é".repeat(MAX_ANALYSIS_BYTES / 2 + 1)), /1 MiB/);
});

test("dataset replacement is rejected if its finite numbers overflow report arithmetic", () => {
  assert.throws(() => parseAnalysisCSV("category,value,growth,target\na,9e307,0,0\nb,9e307,0,0"), /finite numerical range/);
});

test("descriptive values are computed from the supplied rows, with population deviation", () => {
  const result = summarizeRows(rows([1, 2, 3, 4]));
  assert.equal(result.count, 4);
  assert.equal(result.sum, 10);
  assert.equal(result.mean, 2.5);
  assert.equal(result.median, 2.5);
  assert.equal(result.range, 3);
  close(result.stdDev, Math.sqrt(1.25));
  close(summarizeRows(rows([1e16, 1, -1e16])).sum, 1);
});

test("exact ascending and descending lines recover coefficients and forecasts", () => {
  for (const [values, slope, intercept] of [[[10, 20, 30], 10, 0], [[6, 3, 0], -3, 9]]) {
    const fit = fitRowTrend(rows(values));
    close(fit.slope, slope);
    close(fit.intercept, intercept);
    close(fit.rSquared, 1);
    close(fit.coefficient, Math.sign(slope));
    close(fit.predict(4), 4 * slope + intercept);
  }
});

test("nonperfect fixture matches independently calculated OLS and Pearson identities", () => {
  const fit = fitRowTrend(rows([-1, 1, -1, 1]));
  close(fit.slope, 2 / 5);
  close(fit.intercept, -1);
  close(fit.coefficient, 1 / Math.sqrt(5));
  close(fit.rSquared, 1 / 5);
});

test("the shipped example's fit is actually 440 per row, with predictions 6250 and 6690", () => {
  const result = analyzeRows(rows([4500, 5200, 4800, 6100]), "regression");
  close(result.rSquared, 484 / 725);
  close(result.predictions[0].predictedY, 6250);
  close(result.predictions[1].predictedY, 6690);
});

test("trend calculation is stable under large translation and rescaling", () => {
  for (const multiplier of [1e-150, 1, 1e150]) {
    const fit = fitRowTrend(rows([1, 2, 3].map(value => value * multiplier)));
    close(fit.slope / multiplier, 1);
    close(fit.predict(4) / multiplier, 4);
    close(fit.coefficient, 1);
  }
  const shifted = fitRowTrend(rows([1e12 + 1, 1e12 + 2, 1e12 + 3]));
  close(shifted.slope, 1);
  assert.equal(shifted.predict(4), 1e12 + 4);
});

test("constant outcomes have undefined correlation and R-squared but valid constant forecasts", () => {
  const fit = fitRowTrend(rows([7, 7, 7]));
  assert.equal(fit.coefficient, null);
  assert.equal(fit.rSquared, null);
  assert.equal(fit.slope, 0);
  assert.equal(fit.predict(4), 7);
  assert.throws(() => fitRowTrend(rows([7])), /at least two/);
});

test("calculated features do not invent significance, confidence or prediction intervals", () => {
  const correlation = analyzeRows(rows([1, 2, 3]), "correlation");
  assert.equal("pValue" in correlation, false);
  const forecast = analyzeRows(rows([1, 2, 3]), "forecast");
  assert.equal("confidence" in forecast, false);
  assert.deepEqual(forecast.predictions.map(item => item.value), [4, 5, 6]);
  assert.ok(forecast.predictions.every(item => !("lowerBound" in item) && !("upperBound" in item)));
  const different = analyzeRows(rows([30, 20, 10]), "forecast");
  close(different.predictions[0].value, 0);
});

test("target comparisons retain zero denominators as undefined percentages", () => {
  const data = rows([3, -2, 7]);
  data[1].target = -4;
  data[2].target = 0;
  const result = analyzeRows(data, "compare");
  assert.deepEqual(result.comparisons.map(item => item.percentage), [50, 50, null]);
  assert.equal(result.totalDifference, 10);
});

test("offline insights describe their input and never substitute the canned example", () => {
  const result = descriptiveInsights(rows([100, 200]));
  assert.match(result.join("\n"), /2 observations; mean 150/);
  assert.doesNotMatch(result.join("\n"), /Q[1-4]|8\.2%|seasonal|significant|Recommendation/);
});

test("direct callers cannot bypass finite numeric row admission", () => {
  for (const value of [NaN, Infinity, "12", true, null]) {
    assert.throws(() => summarizeRows(rows([value])), /finite numbers/);
  }
  assert.throws(() => summarizeRows([]), /requires/);
});
