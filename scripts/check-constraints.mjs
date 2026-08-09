#!/usr/bin/env node

/**
 * Design-constraint linter
 *
 * Governing specs: HANDOVER §1.2, §1.7, §1.8, §4, §5 and MASTERPLAN §6.2, §13.
 *
 * This file was previously weakened so that hand-written overrides would
 * pass: the entire rounded-* family, bg-gradient-, backdrop-blur,
 * animate-pulse, animate-bounce and blur- had been deleted from the banned
 * list, which hid 111 real violations. HANDOVER §1.7 is explicit that the
 * violations get fixed, not the linter. Do not weaken it again. Add checks.
 *
 * Run: npm run lint:constraints
 * Escape hatch: // constraint-ok: <reason>  (report every use)
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname, relative } from "path";

const ROOT = process.cwd();
const SKIP_DIRS = [
  "node_modules",
  ".next",
  ".git",
  "public",
  "dist",
  ".vercel",
  ".github",
];
const SOURCE_EXTS = new Set([".ts", ".tsx", ".css", ".mjs", ".js", ".jsx"]);
const TOKENS_FILE = "styles/tokens.css";

let errors = 0;
let warnings = 0;
let escapeHatchCount = 0;
const escapeHatchSites = [];

// ── Banned Tailwind class fragments ─────────────────────────
// rounded-lg (12px) and shadow-md are permitted: HANDOVER §1.7 allows
// removing them once they map to permitted token values, and §1.8 raised
// the ceiling to --radius-md 8px with --radius-lg 12px for large media.
const BANNED_CLASSES = [
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  "bg-gradient-",
  "backdrop-blur",
  "animate-pulse",
  "animate-bounce",
  "blur-",
];

const BANNED_COLOUR_PREFIXES = [
  "bg-slate-",
  "text-slate-",
  "border-slate-",
  "bg-gray-",
  "text-gray-",
  "border-gray-",
  "bg-zinc-",
  "text-zinc-",
  "border-zinc-",
  "bg-neutral-",
  "text-neutral-",
  "border-neutral-",
  "bg-stone-",
  "text-stone-",
  "border-stone-",
  "bg-red-",
  "text-red-",
  "border-red-",
  "bg-orange-",
  "text-orange-",
  "border-orange-",
  "bg-amber-",
  "text-amber-",
  "border-amber-",
  "bg-yellow-",
  "text-yellow-",
  "border-yellow-",
  "bg-lime-",
  "text-lime-",
  "border-lime-",
  "bg-green-",
  "text-green-",
  "border-green-",
  "bg-emerald-",
  "text-emerald-",
  "border-emerald-",
  "bg-teal-",
  "text-teal-",
  "border-teal-",
  "bg-cyan-",
  "text-cyan-",
  "border-cyan-",
  "bg-sky-",
  "text-sky-",
  "border-sky-",
  "bg-blue-",
  "text-blue-",
  "border-blue-",
  "bg-indigo-",
  "text-indigo-",
  "border-indigo-",
  "bg-violet-",
  "text-violet-",
  "border-violet-",
  "bg-purple-",
  "text-purple-",
  "border-purple-",
  "bg-fuchsia-",
  "text-fuchsia-",
  "border-fuchsia-",
  "bg-pink-",
  "text-pink-",
  "border-pink-",
  "bg-rose-",
  "text-rose-",
  "border-rose-",
];

const BANNED_FONTS = [
  "font-[Inter]",
  "font-[Geist]",
  "font-[Poppins]",
  "font-[Montserrat]",
  "font-['Plus_Jakarta_Sans']",
  '"Inter"',
  "'Inter'",
  '"Geist"',
  "'Geist'",
  '"Poppins"',
  "'Poppins'",
  '"Montserrat"',
  "'Montserrat'",
];

// HANDOVER §5. These fail the build, in JSX text and message catalogues
// alike. The previous version only scanned messages/*.json and only warned,
// which let "World-class" and "your journey" through in JSX.
const BANNED_WORDS = [
  "journey",
  "seamless",
  "empower",
  "elevate",
  "world-class",
  "cutting-edge",
  "one-stop",
  "leverage",
  "unlock",
  "robust",
  "take it to the next level",
  "fast-paced world",
];

// ── Gold is a dark-surface accent only (HANDOVER §1.8) ──────
// #b99257 measures 5.47:1 on --navy and 6.32:1 on --navy-deep, but only
// 2.57:1 on --paper and 4.05:1 on --navy-soft. Both fail AA.
const GOLD_UTILITIES = /\b(?:text|border|from|via|to|decoration|ring|outline)-gold\b/;
const GOLD_ANY =
  /\bbg-gold\b|\b(?:text|border|from|via|to|decoration|ring|outline)-gold\b/;
// Gold is permitted only inside a container explicitly marked `on-dark`.
// Inferring the surface from "does this file mention bg-navy anywhere" was too
// loose: a card component can carry a navy CTA button and still put gold icons
// on a white card, which is 2.57:1 and fails both AA text contrast and the 3:1
// floor for meaningful non-text content. Requiring the marker makes the intent
// explicit and the check decidable.
const DARK_SURFACES = /\bon-dark\b/;
const LIGHT_SURFACES = /\bbg-paper\b|\bbg-paper-raised\b|\bbg-white\b|\bbg-sand\b/;
const GOLD_BANNED_SURFACE = /\bbg-navy-soft\b/;

// ── Content that expires (HANDOVER §4, §5) ──────────────────
// This is a static site with no backend and infrequent manual updates.
// Anything with a short half-life becomes wrong on its own.
const EXPIRING_PATTERNS = [
  [
    /\b(?:GHS|NGN|TRY)\b/,
    "Non-USD currency. HANDOVER §4.1 bans currency conversion: USD only, with a reviewedOn stamp.",
  ],
  [
    /days?\s+(?:remaining|left)|countdown|daysUntil|timeRemaining/i,
    "Countdown or days-remaining. HANDOVER §4.1 bans these outright.",
  ],
  [/\bDeadlineModule\b/, "DeadlineModule is deleted per HANDOVER §4.1."],
  [
    /exchangeRate|conversionRate|fxRate|rateDate/i,
    "Currency conversion. HANDOVER §4.1 bans live or hardcoded rates.",
  ],
];

// ── Helpers ─────────────────────────────────────────────────

function walk(dir, visit) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    else visit(fullPath);
  }
}

// Strip code comments so a banned word in an explanatory comment (like this
// file's own header) does not fail the build. Only shipped copy matters.
function isComment(trimmed) {
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("{/*") ||
    trimmed.startsWith("<!--")
  );
}

function checkSourceFile(filePath, fileText) {
  const rel = relative(ROOT, filePath);
  if (rel === TOKENS_FILE) return;
  if (rel.startsWith("scripts/")) return;
  if (rel === "postcss.config.mjs") return;

  const lines = fileText.split("\n");
  // File-level: a file with no dark surface anywhere cannot legally use gold.
  const fileHasDarkSurface = DARK_SURFACES.test(fileText);
  let inBlockComment = false;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Track multi-line comments so prose inside them (including this repo's
    // own explanatory notes naming banned patterns) is not treated as code.
    const startedInBlockComment = inBlockComment;
    const opens = (line.match(/\/\*/g) || []).length;
    const closes = (line.match(/\*\//g) || []).length;
    if (opens > closes) inBlockComment = true;
    else if (closes > opens) inBlockComment = false;

    // A CSS custom-property declaration such as `--shadow-lg: initial` is how
    // a banned utility gets switched off, not a use of it.
    const isCustomPropertyDecl = /^\s*--[\w-]+\s*:/.test(line);

    const comment =
      startedInBlockComment ||
      inBlockComment ||
      isComment(trimmed) ||
      isCustomPropertyDecl;

    if (line.includes("constraint-ok:")) {
      escapeHatchCount++;
      escapeHatchSites.push(`${rel}:${lineNum}`);
      return;
    }

    if (!comment) {
      for (const cls of BANNED_CLASSES) {
        if (line.includes(cls)) {
          report(rel, lineNum, `Banned class "${cls}". See HANDOVER §1.2/§1.8.`);
        }
      }
      for (const prefix of BANNED_COLOUR_PREFIXES) {
        if (line.includes(prefix)) {
          report(
            rel,
            lineNum,
            `Banned stock colour "${prefix}…". Use a token from tokens.css.`
          );
        }
      }

      // ── Gold on a light or sub-AA surface ──
      if (GOLD_ANY.test(line)) {
        if (LIGHT_SURFACES.test(line)) {
          report(
            rel,
            lineNum,
            "Gold on a light surface (2.57:1, fails AA). Gold is a --navy / --navy-deep accent only. HANDOVER §1.8."
          );
        } else if (GOLD_BANNED_SURFACE.test(line)) {
          report(
            rel,
            lineNum,
            "Gold on --navy-soft (4.05:1, fails AA). Permitted on --navy and --navy-deep only."
          );
        } else if (!fileHasDarkSurface && GOLD_UTILITIES.test(line)) {
          report(
            rel,
            lineNum,
            "Gold used in a file with no dark surface, so it renders on light and fails AA. HANDOVER §1.8."
          );
        }
      }

      for (const [pattern, message] of EXPIRING_PATTERNS) {
        if (pattern.test(line)) report(rel, lineNum, message);
      }
    }

    for (const font of BANNED_FONTS) {
      if (line.includes(font)) {
        report(
          rel,
          lineNum,
          `Banned font "${font}". Newsreader / Instrument Sans / IBM Plex Mono only.`
        );
      }
    }

    if (
      /#[0-9a-fA-F]{3,8}\b/.test(line) &&
      !line.includes("--") &&
      !line.includes("href=") &&
      !line.includes("id=") &&
      !/['"]#[0-9a-fA-F]+['"]/.test(line)
    ) {
      report(rel, lineNum, "Hardcoded hex colour. Use a CSS variable from tokens.css.");
    }

    if (/rgba?\(\s*\d/.test(line) && !line.includes("--")) {
      report(rel, lineNum, "Hardcoded rgb() colour. Use a CSS variable from tokens.css.");
    }

    if (/backdrop-filter/.test(line) && !comment) {
      report(
        rel,
        lineNum,
        "backdrop-filter (glassmorphism) is banned. MASTERPLAN §6.2, HANDOVER §1.4."
      );
    }

    if (line.includes("—") && !comment) {
      report(rel, lineNum, "Em dash. Use commas, colons, or full stops.");
    }

    if (
      /(?:api[_-]?key|secret|password|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}/i.test(line)
    ) {
      report(rel, lineNum, "Possible API key / secret committed in source.");
    }

    if (/unsafe-inline|unsafe-eval/.test(line) && !line.includes("isDev")) {
      report(
        rel,
        lineNum,
        "'unsafe-inline' / 'unsafe-eval' in CSP is banned. Use nonces. HANDOVER §5."
      );
    }

    // ── Banned copy, in JSX text as well as catalogues ──
    if (!comment) {
      const lower = line.toLowerCase();
      for (const word of BANNED_WORDS) {
        if (!lower.includes(word)) continue;
        // Only flag inside rendered text or string literals, not identifiers
        // like `leverageRatio`. Require a word boundary on both sides.
        const re = new RegExp(
          `(^|[^a-z0-9-])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9-]|$)`,
          "i"
        );
        if (re.test(line)) {
          report(rel, lineNum, `Banned word "${word}" in copy. HANDOVER §5.`);
        }
      }
    }
  });
}

function checkMessageFile(filePath, content) {
  const rel = relative(ROOT, filePath);
  const lower = content.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      report(rel, 0, `Banned word "${word}" in message catalogue. HANDOVER §5.`);
    }
  }
  if (content.includes("—")) {
    report(rel, 0, "Em dash in message catalogue. Use commas, colons, or full stops.");
  }
  const todoCount = (content.match(/TODO/gi) || []).length;
  if (todoCount > 0) {
    warn(rel, 0, `${todoCount} [TODO] placeholder(s). Must be zero before launch.`);
  }
}

// Q2: no file other than the root specs may give Payload or Supabase
// architecture instructions. MASTERPLAN v3.0 removed the database; a stale
// doc telling the next agent to build Payload on Supabase is a real hazard.
function checkNoSupersededArchitecture() {
  const OFFENDERS = [
    /payload\s*cms/i,
    /@payloadcms\//i,
    /payloadcms/i,
    /supabase/i,
    /db-postgres/i,
    /richtext-lexical/i,
  ];
  const ALLOWED = new Set(["MASTERPLAN.md", "HANDOVER.md"]);
  const hits = [];
  walk(ROOT, (filePath) => {
    const rel = relative(ROOT, filePath);
    if (extname(filePath) !== ".md") return;
    if (ALLOWED.has(rel)) return;
    const text = readFileSync(filePath, "utf-8");
    for (const re of OFFENDERS) {
      if (re.test(text)) {
        hits.push([rel, re.source]);
        break;
      }
    }
  });
  for (const [rel, pattern] of hits) {
    report(
      rel,
      0,
      `Superseded architecture instructions (/${pattern}/). MASTERPLAN v3.0 removed the database. Root MASTERPLAN.md and HANDOVER.md are the only specs.`
    );
  }
}

function report(file, line, message) {
  console.error(`  ✗ ${file}${line > 0 ? `:${line}` : ""} — ${message}`);
  errors++;
}

function warn(file, line, message) {
  console.warn(`  ⚠ ${file}${line > 0 ? `:${line}` : ""} — ${message}`);
  warnings++;
}

// ── Run ─────────────────────────────────────────────────────

console.log("\u{1f50d} Running design-constraint linter…\n");

walk(ROOT, (filePath) => {
  const ext = extname(filePath);
  if (SOURCE_EXTS.has(ext)) {
    checkSourceFile(filePath, readFileSync(filePath, "utf-8"));
  }
  if (ext === ".json" && filePath.includes("messages")) {
    checkMessageFile(filePath, readFileSync(filePath, "utf-8"));
  }
});

checkNoSupersededArchitecture();

// ── Static asset checks ─────────────────────────────────────

const grainPath = join(ROOT, "public/textures/paper-grain.png");
if (!existsSync(grainPath)) {
  report("public/textures/paper-grain.png", 0, "Paper-grain texture is missing.");
} else if (statSync(grainPath).size > 8192) {
  report(
    "public/textures/paper-grain.png",
    0,
    `Texture is ${statSync(grainPath).size} bytes (must be <= 8 KB).`
  );
}

const envExamplePath = join(ROOT, ".env.example");
if (!existsSync(envExamplePath)) {
  report(".env.example", 0, ".env.example is missing.");
} else {
  const envContent = readFileSync(envExamplePath, "utf-8");
  for (const key of ["NEXT_PUBLIC_SITE_URL", "SITE_MODE"]) {
    if (!envContent.includes(key)) {
      report(".env.example", 0, `Missing ${key} in .env.example.`);
    }
  }
}

// The logo must exist as SVG: a JPEG cannot be recoloured for the navy
// panels and carries compression artefacts. MASTERPLAN §6.9, HANDOVER §1.6.
if (!existsSync(join(ROOT, "public/logo.svg"))) {
  report("public/logo.svg", 0, "SVG logo is missing. HANDOVER §1.6.");
}

// ── Escape hatch audit ──────────────────────────────────────

if (escapeHatchCount > 0) {
  console.log(
    `\n\u{1f4cb} Escape hatch (constraint-ok) used ${escapeHatchCount} time(s):`
  );
  for (const site of escapeHatchSites) console.log(`     ${site}`);
  if (escapeHatchCount > 2) {
    warn(
      "(global)",
      0,
      "More than 2 escape hatches. The design system may have a gap to fix rather than bypass."
    );
  }
}

// ── Summary ─────────────────────────────────────────────────

console.log("");
if (errors > 0) console.error(`❌ ${errors} constraint violation(s).`);
if (warnings > 0) console.warn(`⚠️  ${warnings} warning(s).`);
if (errors === 0 && warnings === 0) console.log("✅ All design constraints passed.\n");
else if (errors === 0)
  console.log("✅ No hard violations. Warnings above are non-blocking.\n");

if (errors > 0) process.exit(1);
