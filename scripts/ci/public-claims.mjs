import fs from "node:fs";

const files = {
  index: "src/pages/Index.tsx",
  problem: "src/pages/TheProblem.tsx",
  cta: "src/components/landing/CTASection.tsx",
  footer: "src/components/layout/Footer.tsx",
};

const contents = Object.fromEntries(
  Object.entries(files).map(([name, path]) => [name, fs.readFileSync(path, "utf8")]),
);

const landingForbiddenImports = [
  "StatsSection",
  "TestimonialsSection",
  "WhyUsSection",
  "FounderSection",
];

for (const identifier of landingForbiddenImports) {
  if (contents.index.includes(identifier)) {
    throw new Error(
      `public landing page re-enabled ${identifier} without a retained claim-evidence review`,
    );
  }
}

const publicSurface = Object.values(contents).join("\n");
const forbiddenClaims = [
  "10,000+ students",
  "10K+ Students",
  "50+ Countries",
  "50K+",
  "150+ Countries",
  "4.9★",
  "85% Complete Projects",
  "Researchers Love Us!",
  "Join thousands of student researchers",
  "Trusted by students in 50+ countries",
  "The Numbers Don't Lie",
  "Real Voices",
  "Nobel Prizes by 18",
];

for (const claim of forbiddenClaims) {
  if (publicSurface.includes(claim)) {
    throw new Error(`unsupported public claim returned to a rendered surface: ${claim}`);
  }
}

if (!fs.existsSync("docs/PUBLIC_CLAIMS_POLICY.md")) {
  throw new Error("missing docs/PUBLIC_CLAIMS_POLICY.md");
}

console.log("public claims guard passed");
