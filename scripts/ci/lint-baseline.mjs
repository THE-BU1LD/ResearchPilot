import { readFileSync } from "node:fs";
import { relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

const baselinePath = new URL("../../ci/eslint-known-errors.json", import.meta.url);
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));

const makeKey = (file, rule, message) => `${file}\u0000${rule ?? "<fatal>"}\u0000${message}`;
const allowed = new Map(
  baseline.map(({ file, rule, message, count }) => [makeKey(file, rule, message), count]),
);

const run = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["eslint", ".", "--format", "json"],
  { cwd: process.cwd(), encoding: "utf8" },
);

if (run.error) {
  console.error(`Unable to execute ESLint: ${run.error.message}`);
  process.exit(2);
}

let report;
try {
  report = JSON.parse(run.stdout || "[]");
} catch (error) {
  console.error("ESLint did not return parseable JSON.");
  if (run.stdout) console.error(run.stdout);
  if (run.stderr) console.error(run.stderr);
  console.error(error);
  process.exit(2);
}

const actual = new Map();
const details = new Map();
let warningCount = 0;

for (const result of report) {
  const file = relative(process.cwd(), result.filePath).split(sep).join("/");
  for (const message of result.messages) {
    if (message.severity === 1) {
      warningCount += 1;
      continue;
    }
    if (message.severity !== 2) continue;

    const key = makeKey(file, message.ruleId, message.message);
    actual.set(key, (actual.get(key) ?? 0) + 1);
    if (!details.has(key)) {
      details.set(key, {
        file,
        rule: message.ruleId ?? "<fatal>",
        message: message.message,
        line: message.line,
        column: message.column,
      });
    }
  }
}

const regressions = [];
for (const [key, count] of actual) {
  const permitted = allowed.get(key) ?? 0;
  if (count > permitted) {
    regressions.push({ ...details.get(key), count, permitted });
  }
}

if (regressions.length > 0) {
  console.error("New ESLint errors exceed the checked-in baseline:");
  for (const item of regressions) {
    console.error(
      `- ${item.file}:${item.line}:${item.column} ${item.rule}: ${item.message} ` +
      `(observed ${item.count}, baseline ${item.permitted})`,
    );
  }
  process.exit(1);
}

const baselineErrorCount = [...actual.values()].reduce((sum, count) => sum + count, 0);
console.log(
  `ESLint non-regression gate passed: ${baselineErrorCount} known baseline error(s), ` +
  `${warningCount} warning(s), and no new errors.`,
);
