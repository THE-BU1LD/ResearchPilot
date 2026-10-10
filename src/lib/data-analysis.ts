/** Deterministic analysis of the explicit Research Muse CSV column contract. */
export const MAX_ANALYSIS_ROWS = 10_000;
export const MAX_ANALYSIS_BYTES = 1_048_576;

export interface AnalysisRow {
  [key: string]: string | number;
  category: string;
  value: number;
  growth: number;
  target: number;
}

const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const REQUIRED = ["category", "value", "growth", "target"] as const;

function finite(value: number, description: string): number {
  if (!Number.isFinite(value)) throw new Error(`${description} exceeds the finite numerical range`);
  return value;
}

/** Parse quoted CSV fields, including escaped quotes and embedded newlines. */
export function parseAnalysisCSV(text: string): AnalysisRow[] {
  if (typeof text !== "string" || text.length > MAX_ANALYSIS_BYTES || new TextEncoder().encode(text).length > MAX_ANALYSIS_BYTES) {
    throw new Error("CSV files are limited to 1 MiB");
  }
  text = text.replace(/^\uFEFF/, "");
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let mode: "plain" | "quoted" | "closed" = "plain";
  const endField = () => { row.push(field); field = ""; mode = "plain"; };
  const endRow = () => {
    endField();
    if (row.length !== 1 || row[0].trim() !== "") records.push(row);
    if (records.length > MAX_ANALYSIS_ROWS + 1) throw new Error("CSV files are limited to 10,000 data rows");
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (mode === "quoted") {
      if (character !== '"') field += character;
      else if (text[i + 1] === '"') { field += '"'; i++; }
      else mode = "closed";
      continue;
    }
    if (character === ",") { endField(); continue; }
    if (character === "\n" || character === "\r") {
      endRow();
      if (character === "\r" && text[i + 1] === "\n") i++;
      continue;
    }
    if (mode === "closed") {
      if (character !== " " && character !== "\t") throw new Error("Unexpected character after a closing CSV quote");
    } else if (character === '"') {
      if (field.trim() !== "") throw new Error("CSV quotes must enclose the entire field");
      field = "";
      mode = "quoted";
    } else field += character;
  }
  if (mode === "quoted") throw new Error("CSV contains an unclosed quoted field");
  if (row.length || field.length || mode === "closed") endRow();
  if (records.length < 2) throw new Error("CSV needs a header and at least one data row");
  const headers = records[0].map(header => header.trim());
  if (headers.some(header => !header) || new Set(headers).size !== headers.length) {
    throw new Error("CSV headers must be nonempty and unique");
  }
  if (!REQUIRED.every(column => headers.includes(column))) {
    throw new Error("CSV requires category, value, growth and target columns");
  }
  const rows = records.slice(1).map((cells, index) => {
    if (cells.length !== headers.length) throw new Error(`CSV data row ${index + 1} has the wrong number of fields`);
    const record: Record<string, string | number> = Object.fromEntries(headers.map((header, j) => [header, cells[j].trim()]));
    if (!record.category) throw new Error(`CSV data row ${index + 1} needs a category`);
    for (const column of ["value", "growth", "target"] as const) {
      const value = String(record[column]);
      if (!NUMBER.test(value) || !Number.isFinite(Number(value))) {
        throw new Error(`CSV data row ${index + 1}, ${column} must be a complete finite number`);
      }
      record[column] = Number(value);
    }
    return record as AnalysisRow;
  });
  summarizeRows(rows); // Reject numerical overflow before replacing the current dataset.
  return rows;
}

function checkedRows(rows: readonly AnalysisRow[]): void {
  if (!Array.isArray(rows) || !rows.length || rows.length > MAX_ANALYSIS_ROWS) throw new Error("Analysis requires 1 to 10,000 rows");
  for (const row of rows) {
    if (!row || typeof row.category !== "string" || !row.category.trim()) throw new Error("Every row requires a category");
    for (const column of ["value", "growth", "target"] as const) {
      if (typeof row[column] !== "number" || !Number.isFinite(row[column])) throw new Error(`${column} must contain only finite numbers`);
    }
  }
}

function compensatedSum(values: readonly number[]): number {
  let sum = 0;
  let correction = 0;
  for (const value of values) {
    const next = sum + value;
    correction += Math.abs(sum) >= Math.abs(value) ? (sum - next) + value : (value - next) + sum;
    sum = next;
  }
  return sum + correction;
}

function sum(values: readonly number[]): number {
  const scale = Math.max(...values.map(value => Math.abs(value)));
  return scale === 0 ? 0 : finite(compensatedSum(values.map(value => value / scale)) * scale, "Sum");
}

export function summarizeRows(rows: readonly AnalysisRow[]) {
  checkedRows(rows);
  const values = rows.map(row => row.value);
  const total = sum(values);
  const mean = total / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const lower = sorted[middle - 1], upper = sorted[middle];
  const median = sorted.length % 2 ? upper : lower + (upper - lower) / 2;
  const deviations = values.map(value => value - mean);
  const scale = Math.max(...deviations.map(value => Math.abs(value)));
  const stdDev = scale === 0 ? 0 : scale * Math.sqrt(compensatedSum(deviations.map(value => (value / scale) ** 2)) / values.length);
  return {
    count: rows.length, sum: total, mean, median: finite(median, "Median"),
    min: sorted[0], max: sorted[sorted.length - 1], range: finite(sorted[sorted.length - 1] - sorted[0], "Range"),
    stdDev: finite(stdDev, "Population standard deviation"), avgGrowth: sum(rows.map(row => row.growth)) / rows.length,
  };
}

/** OLS and Pearson correlation use x = 1..n in the current row order. */
export function fitRowTrend(rows: readonly AnalysisRow[]) {
  summarizeRows(rows);
  if (rows.length < 2) throw new Error("A row trend requires at least two observations");
  const xMean = (rows.length + 1) / 2;
  const dx = rows.map((_, index) => index + 1 - xMean);
  const anchor = rows[0].value;
  const offsets = rows.map(row => row.value - anchor);
  const scale = Math.max(...offsets.map(value => Math.abs(value)));
  const normalizedOffsets = scale === 0 ? offsets : offsets.map(value => value / scale);
  const meanOffset = compensatedSum(normalizedOffsets) / rows.length;
  const normalized = normalizedOffsets.map(value => value - meanOffset);
  const sxx = compensatedSum(dx.map(value => value * value));
  const syy = compensatedSum(normalized.map(value => value * value));
  const sxy = compensatedSum(dx.map((value, index) => value * normalized[index]));
  const scaledSlope = sxy / sxx;
  const slope = finite(scaledSlope * scale, "Regression slope");
  const intercept = finite(anchor + (meanOffset - scaledSlope * xMean) * scale, "Regression intercept");
  const coefficient = syy === 0 ? null : Math.max(-1, Math.min(1, (sxy / Math.sqrt(sxx)) / Math.sqrt(syy)));
  const rSquared = coefficient === null ? null : coefficient ** 2;
  const predict = (index: number) => finite(anchor + (meanOffset + scaledSlope * (finite(index, "Row index") - xMean)) * scale, "Linear extrapolation");
  return { count: rows.length, slope, intercept, coefficient, rSquared, predict };
}

export type AnalysisFeature = "regression" | "correlation" | "forecast" | "compare";

export function analyzeRows(rows: readonly AnalysisRow[], feature: AnalysisFeature) {
  if (feature === "compare") {
    const summary = summarizeRows(rows);
    const comparisons = rows.map(row => {
      const difference = finite(row.value - row.target, "Target difference");
      const percentage = row.target === 0 ? null : finite((difference / Math.abs(row.target)) * 100, "Target percentage");
      return { category: row.category, difference, percentage };
    });
    const totalTarget = sum(rows.map(row => row.target));
    return { kind: "compare" as const, comparisons, totalDifference: finite(summary.sum - totalTarget, "Total target difference") };
  }
  const fit = fitRowTrend(rows);
  const context = `Calculated from ${fit.count} rows using x = row index (1 through ${fit.count}).`;
  if (feature === "regression") {
    return {
      kind: "regression" as const, equation: `value = ${fit.slope.toPrecision(6)} × row index + (${fit.intercept.toPrecision(6)})`,
      rSquared: fit.rSquared, interpretation: context,
      predictions: [fit.count + 1, fit.count + 2].map(x => ({ x, predictedY: fit.predict(x) })),
      recommendation: "Extrapolations assume the fitted row-order trend continues; row labels are not interpreted as dates.",
    };
  }
  if (feature === "correlation") {
    return {
      kind: "correlation" as const, coefficient: fit.coefficient, count: fit.count,
      strength: fit.coefficient === null ? "Undefined for constant values" : fit.coefficient > 0 ? "Positive association" : fit.coefficient < 0 ? "Negative association" : "No linear association",
      interpretation: context,
      caveats: ["Descriptive association between row order and value; no p-value is estimated.", "Correlation does not establish causation."],
    };
  }
  if (feature !== "forecast") throw new Error("Unknown analysis feature");
  return {
    kind: "forecast" as const, method: "OLS linear extrapolation by row index",
    predictions: [1, 2, 3].map(offset => ({ period: `Row ${fit.count + offset}`, value: fit.predict(fit.count + offset) })),
    trend: fit.slope > 0 ? "increasing" : fit.slope < 0 ? "decreasing" : "constant",
    explanation: `${context} These are point extrapolations. No prediction interval or calibrated confidence is estimated.`,
  };
}

export function descriptiveInsights(rows: readonly AnalysisRow[]): string[] {
  const stats = summarizeRows(rows);
  return [
    `[INSIGHT] ${stats.count} observations; mean ${stats.mean.toPrecision(6)} and median ${stats.median.toPrecision(6)}.`,
    `[INSIGHT] Observed values range from ${stats.min.toPrecision(6)} to ${stats.max.toPrecision(6)}; population standard deviation ${stats.stdDev.toPrecision(6)}.`,
    `[INSIGHT] Mean of the supplied growth percentages: ${stats.avgGrowth.toPrecision(6)}%.`,
  ];
}
