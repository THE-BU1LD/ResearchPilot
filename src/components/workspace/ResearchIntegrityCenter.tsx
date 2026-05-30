import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Scale, FileSearch, Sparkles, ArrowRight, CheckCircle2, ShieldAlert, BookOpenText, Copy, ClipboardCheck } from "lucide-react";

type IntegrityRisk = {
  label: string;
  level: "low" | "medium" | "high";
  explanation: string;
};

type PhraseHit = {
  phrase: string;
  sourceIndex: number;
};

const STOPWORDS = new Set([
  "the","and","or","but","for","with","that","this","from","into","your","you","are","was","were","have","has","had","not","will","would","can","could","should","about","there","their","them","they","then","than","when","what","which","who","whom","why","how","where","been","being","also","very","more","most","such","these","those","its","it's","our","out","over","under","within","without","between","across","after","before","during","because","through","while","each","per","via","may","might","must","should"
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9\s'/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text: string) {
  return normalize(text)
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean);
}

function uniqueContentWords(text: string) {
  return words(text).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function jaccard(a: string[], b: string[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size || 1;
  return inter / union;
}

function phraseWindows(tokens: string[], size = 7) {
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - size; i += Math.max(1, Math.floor(size / 2))) {
    const phrase = tokens.slice(i, i + size).join(" ");
    if (phrase.length > 18) out.push(phrase);
  }
  return out;
}

function detectRepeatedPhrases(text: string): string[] {
  const tokens = uniqueContentWords(text);
  const counts = new Map<string, number>();
  for (const size of [4, 5, 6, 7]) {
    for (const phrase of phraseWindows(tokens, size)) {
      counts.set(phrase, (counts.get(phrase) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([phrase]) => phrase)
    .slice(0, 5);
}

function detectCitationSignals(text: string) {
  const citationPattern = /(\([A-Z][A-Za-z-]+(?:\s+et al\.)?,?\s+\d{4}[a-z]?\)|\[[0-9,\s-]+\]|doi:\s*10\.\d{4,9}\/\S+|https?:\/\/\S+)/gi;
  const matches = text.match(citationPattern) || [];
  return matches.length;
}

function summarizeEthics(text: string): IntegrityRisk[] {
  const t = normalize(text);
  const risks: IntegrityRisk[] = [];

  const add = (label: string, level: IntegrityRisk["level"], explanation: string) => {
    risks.push({ label, level, explanation });
  };

  if (/(human subjects?|participants?|survey|interview|questionnaire|focus group)/i.test(text)) {
    add("Human-subjects protocol", "medium", "Make sure consent, anonymity, and withdrawal rights are clear before collecting any data.");
  }
  if (/(minor|teen|adolescent|student data|school records)/i.test(text)) {
    add("Minors & school data", "high", "Research involving minors needs extra care: parental permission, school approval, and minimal data collection.");
  }
  if (/(medical|health|diagnos|therapy|clinical|mental health)/i.test(text)) {
    add("Health claims", "high", "Avoid medical advice or diagnosis language unless your method and supervision clearly support it.");
  }
  if (/(personal data|email|phone|address|location|gps|private|confidential|face|photo|image)/i.test(text)) {
    add("Privacy & data minimization", "high", "Only collect what you truly need and remove personal identifiers whenever possible.");
  }
  if (/(bias|fairness|dispar|stereotype|protected group|race|religion|gender)/i.test(text)) {
    add("Bias review", "medium", "Check whether your sample, wording, or analysis could disadvantage specific groups.");
  }
  if (/(ai-generated|large language model|chatgpt|copilot|automation)/i.test(text)) {
    add("AI usage disclosure", "medium", "State clearly which parts were AI-assisted and which parts were independently verified by you.");
  }
  if (/(experiment|trial|treatment|control group|randomized)/i.test(text)) {
    add("Experimental safety", "medium", "Check whether the procedure could affect people, animals, or equipment, and add a safety note.");
  }
  if (/(copyright|license|licensed|dataset|proprietary)/i.test(text)) {
    add("Copyright & licensing", "medium", "Make sure any figures, tables, code, or datasets you use are allowed for your purpose and properly attributed.");
  }

  if (risks.length === 0 && t.length > 0) {
    add("General ethics review", "low", "Add a short ethics note covering consent, privacy, bias, and disclosure if relevant.");
  }

  return risks.slice(0, 6);
}

function plagiarismSignals(draft: string, sources: string[]) {
  const draftTokens = uniqueContentWords(draft);
  const draftPhrases = phraseWindows(draftTokens, 7).slice(0, 80);

  const sourceTokens = sources.map((s) => uniqueContentWords(s));
  const sourceText = sources.map((s) => normalize(s)).join(" | ");

  const hits: PhraseHit[] = [];
  for (const phrase of draftPhrases) {
    const phraseText = normalize(phrase);
    for (let i = 0; i < sources.length; i++) {
      if (phraseText.length > 20 && normalize(sources[i]).includes(phraseText)) {
        hits.push({ phrase, sourceIndex: i });
      }
    }
  }

  const overlapScores = sourceTokens.map((tokens) => jaccard(draftTokens, tokens));
  const repeated = detectRepeatedPhrases(draft);

  const suspiciousDensity = draftPhrases.length === 0 ? 0 : hits.length / draftPhrases.length;
  const riskScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (suspiciousDensity * 70) +
          (overlapScores.reduce((a, b) => a + b, 0) / Math.max(1, overlapScores.length) * 60) +
          (repeated.length * 7)
      )
    )
  );

  let label: IntegrityRisk["level"] = "low";
  if (riskScore >= 70) label = "high";
  else if (riskScore >= 35) label = "medium";

  return {
    riskScore,
    label,
    hits,
    repeated,
    citationSignals: detectCitationSignals(draft),
    overlapScores,
    sourceText,
  };
}

function buildRevisionChecklist(draft: string, integrity: ReturnType<typeof plagiarismSignals>, ethics: IntegrityRisk[]) {
  const checklist = [
    "Rewrite any sentences that look too close to your source wording.",
    "Add a citation wherever you rely on a published idea, statistic, or claim.",
    "Replace general statements with specific evidence from your notes or dataset.",
    "Explain your method in a way another student could reproduce.",
    "Add an ethics note for consent, privacy, and bias if your topic involves people or sensitive data.",
  ];

  if (integrity.citationSignals === 0 && draft.trim()) {
    checklist.unshift("Add at least one citation marker before submission.");
  }
  if (integrity.repeated.length > 0) {
    checklist.unshift("Remove repeated phrasing and tighten transitions.");
  }
  if (ethics.some((r) => r.level === "high")) {
    checklist.unshift("Resolve the high-risk ethics items before continuing data collection.");
  }
  return checklist.slice(0, 6);
}

export default function ResearchIntegrityCenter() {
  const [draft, setDraft] = useState("");
  const [sources, setSources] = useState("");
  const [result, setResult] = useState<ReturnType<typeof plagiarismSignals> | null>(null);

  const sourceBlocks = useMemo(
    () => sources.split(/\n{2,}|---+/).map((s) => s.trim()).filter(Boolean),
    [sources]
  );

  const ethics = useMemo(() => summarizeEthics(draft + "\n" + sourceBlocks.join("\n")), [draft, sourceBlocks]);
  const revisionChecklist = useMemo(() => result ? buildRevisionChecklist(draft, result, ethics) : [], [draft, result, ethics]);

  const runScan = () => {
    setResult(plagiarismSignals(draft, sourceBlocks));
  };

  const overallBadge = result
    ? result.label === "high"
      ? "destructive"
      : result.label === "medium"
        ? "secondary"
        : "default"
    : "secondary";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-card border-2 border-foreground shadow-brutal flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground font-comic tracking-wide uppercase">Integrity & Ethics</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Detect overlap risk, flag ethics concerns, and build a safer revision plan without writing the paper for you.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={runScan} className="brutal-button bg-primary text-primary-foreground">
          <FileSearch className="w-4 h-4" />
          Run integrity scan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="brutal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenText className="w-5 h-5" />
              Draft to review
            </CardTitle>
            <CardDescription>Paste the section you want checked for overlap, clarity, and citation discipline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste your draft paragraph, section, or outline here..."
              className="min-h-56"
            />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{draft.split(/\s+/).filter(Boolean).length} words</Badge>
              <Badge variant="outline">{result?.citationSignals ?? 0} citation signals</Badge>
              <Badge variant="outline">{ethics.length} ethics flags</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="brutal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Source notes
            </CardTitle>
            <CardDescription>Paste notes, quotations, or source passages one per block. The scan compares against these notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="One source per block or paragraph."
              className="min-h-56"
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setSources("Paste source passages or notes here, one per line.")}>Reset notes</Button>
              <Button variant="outline" onClick={() => setDraft((prev) => prev + "\n\n[ADD CITATION HERE]")}>Insert citation marker</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 xl:grid-cols-3"
          >
            <Card className="brutal-card xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Similarity risk
                </CardTitle>
                <CardDescription>Heuristic scan of overlap and repetition. This is a warning system, not a verdict.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk level</p>
                    <p className="text-3xl font-bold">{result.riskScore}%</p>
                  </div>
                  <Badge variant={overallBadge as any} className="capitalize">{result.label}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Top signals</p>
                  {result.repeated.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {result.repeated.map((phrase) => (
                        <li key={phrase} className="flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                          <span>{phrase}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No repeated phrase clusters detected.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Potential source overlap</p>
                  {result.hits.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {result.hits.slice(0, 4).map((hit, idx) => (
                        <li key={`${hit.sourceIndex}-${idx}`} className="flex items-start gap-2">
                          <ClipboardCheck className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <span>Matched phrase from source {hit.sourceIndex + 1}: “{hit.phrase}”</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No exact long-phrase matches found in pasted sources.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-card xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Ethics check
                </CardTitle>
                <CardDescription>Flags that usually need human review before a student project can be shared or submitted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {ethics.map((item) => (
                  <div key={item.label} className="rounded-xl border-2 border-foreground/10 bg-background p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.label}</p>
                      <Badge variant={item.level === "high" ? "destructive" : item.level === "medium" ? "secondary" : "outline"} className="capitalize">
                        {item.level}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.explanation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="brutal-card xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Revision plan
                </CardTitle>
                <CardDescription>Safer next steps that improve originality, clarity, and academic honesty.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {revisionChecklist.map((item) => (
                    <li key={item} className="flex gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-comic-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl border-2 border-dashed border-foreground/20 bg-muted/30 p-3 text-sm text-muted-foreground">
                  This panel helps students stay original and ethical. It does not produce a full essay or fabricate sources.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && (
        <Card className="brutal-card">
          <CardContent className="p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">Ready for a risk check?</p>
              <p className="text-sm text-muted-foreground">Paste a draft and a few source notes, then run the scan to see overlap, ethics, and revision guidance.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4" />
              Built for responsible research, not shortcut writing.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
