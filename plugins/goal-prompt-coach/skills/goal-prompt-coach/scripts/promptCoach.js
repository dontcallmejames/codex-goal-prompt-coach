"use strict";

const REQUIRED_OUTPUT_SECTIONS = [
  "/goal Prompt",
  "Assumptions",
  "Clarifying Questions",
  "Tightening Notes",
  "Evaluation",
];

const REQUIRED_GOAL_CHECKS = [
  {
    name: "desired end state",
    test: (goal) => /^\/goal\s+\S[\s\S]+/.test(goal),
  },
  {
    name: "verification surface",
    test: (goal) => /\bverified by\b|\bverify\b|\bverification\b/i.test(goal),
  },
  {
    name: "constraints",
    test: (goal) => /\bwhile preserving\b|\bwithout regressing\b|\bmust not regress\b/i.test(goal),
  },
  {
    name: "boundaries",
    test: (goal) => /\bUse\b[\s\S]+?\bBetween iterations\b/i.test(goal),
  },
  {
    name: "iteration policy",
    test: (goal) => /\bBetween iterations\b/i.test(goal),
  },
  {
    name: "blocked stop condition",
    test: (goal) => /\bIf blocked\b|\bIf .*cannot\b/i.test(goal),
  },
  {
    name: "final reporting expectations",
    test: (goal) => /\bFinish with\b|\bend with\b|\bfinal report\b/i.test(goal),
  },
];

const TYPE_RULES = [
  {
    type: "research",
    pattern: /\b(research|paper|study|reproduce|reproduction|audit|investigate|evidence|claim)\b/i,
  },
  {
    type: "bugfix",
    pattern: /\b(fix|bug|failing|flaky|crash|error|regression|broken|failure|debug)\b/i,
  },
  {
    type: "performance",
    pattern: /\b(faster|slow|latency|performance|optimize|speed|benchmark|p95|throughput)\b/i,
  },
  {
    type: "feature",
    pattern: /\b(add|implement|support|enable|integrate|extend|feature)\b/i,
  },
  {
    type: "frontend_app",
    pattern: /\b(build|create|make|design|dashboard|app|site|website|ui|frontend|screen|page|tool)\b/i,
  },
];

const TYPE_PROFILES = {
  feature: {
    outcome: (idea) => `Implement ${subjectForType(idea, "feature")}`,
    deliverables:
      "a focused implementation, related tests, and any user-facing docs or wiring needed for the feature to work end to end",
    verification:
      "the relevant automated tests, type checks, builds, and targeted manual checks for the changed workflow",
    constraints:
      "existing repo patterns, public API behavior, user-owned changes, accessibility expectations, and unrelated behavior",
    boundaries:
      "the current workspace, existing project conventions, related source files, existing helpers, and focused tests",
    iteration:
      "inspect real context first, use `rg` for search, batch independent reads, make the smallest coherent edits with `apply_patch`, run the strongest available verification, and choose the next fix from actual failures",
    blocked:
      "required dependencies, credentials, fixtures, or commands are unavailable, stop with the attempted paths, exact blocker, evidence gathered, and the smallest user input needed",
    finish:
      "a concise handoff listing files changed, behavior implemented, verification run, and residual risks",
    questions: [
      "What command or user workflow should prove the feature works?",
      "Are there public APIs, data formats, or UX behaviors that must stay unchanged?",
    ],
    notes: [],
  },
  bugfix: {
    outcome: (idea) => `Fix ${subjectForType(idea, "bugfix")}`,
    deliverables:
      "a root-cause fix, a regression test that reproduces the failure first, and any minimal code changes needed to make the failing path reliable",
    verification:
      "the new regression test, the affected test suite, and any reproduction command or log evidence tied to the original symptom",
    constraints:
      "existing behavior outside the failing path, public contracts, user-owned changes, and error visibility",
    boundaries:
      "the failing tests, nearby implementation, fixtures, logs, and existing test helpers",
    iteration:
      "reproduce the issue before changing behavior, inspect the failing path, add or tighten the regression test, implement the smallest root-cause fix, rerun focused and broader tests, and use new failures to choose the next action",
    blocked:
      "the failure cannot be reproduced or required logs/fixtures are missing, stop with the exact commands tried, observed output, likely hypotheses, and the missing evidence needed",
    finish:
      "a concise handoff listing the root cause, changed files, regression coverage, verification output, and any remaining uncertainty",
    questions: [
      "What exact command, test name, log, or user action currently reproduces the bug?",
      "How often does the failure happen, and is it deterministic or flaky?",
    ],
    notes: [],
  },
  frontend_app: {
    outcome: (idea) => `Build a complete usable ${subjectForType(idea, "frontend_app")}`,
    deliverables:
      "a working app experience with core screens, real controls and states, responsive layout, accessible interactions, and polished visual design matched to the domain",
    verification:
      "local dev server checks, browser interaction, desktop and mobile screenshots, responsive layout inspection, and the relevant automated tests or build command",
    constraints:
      "existing design system conventions if present, text fit, non-overlapping UI, accessibility, user-owned changes, and no landing-page-only substitute unless explicitly requested",
    boundaries:
      "the existing app framework if present, otherwise a minimal self-contained app scaffold, local assets, and focused source/test files",
    iteration:
      "inspect the current app first, reuse existing components and icons, implement the primary workflow as the first screen, verify in a browser after meaningful UI changes, fix visual or interaction issues from evidence, and rerun build/tests",
    blocked:
      "the dev server, browser, framework install, or required asset cannot run, stop with exact command output, what was verified another way, and what would unlock visual verification",
    finish:
      "a concise handoff listing files changed, how to run the app, screenshots or browser checks performed, tests/builds run, and remaining limitations",
    questions: [
      "Who is the primary user, and what is the first workflow they should complete?",
      "Should this integrate into an existing app or be scaffolded as a new standalone experience?",
      "Are there brand, design-system, or accessibility requirements to preserve?",
    ],
    notes: [],
  },
  performance: {
    outcome: (idea) => `Improve performance for ${subjectForType(idea, "performance")}`,
    deliverables:
      "a measured performance improvement, targeted code changes, and notes explaining the bottleneck and tradeoffs",
    verification:
      "a baseline and post-change benchmark, profiler output, or other repeatable metric such as p95 latency, throughput, memory, bundle size, or render time",
    constraints:
      "correctness tests, public behavior, reliability, observability, and user-owned changes",
    boundaries:
      "benchmark fixtures, profiling tools available in the workspace, hot-path source files, and related tests",
    iteration:
      "establish a baseline first, identify the largest bottleneck with evidence, make one targeted change at a time, rerun the benchmark and correctness suite, record deltas, and choose the next experiment from measured results",
    blocked:
      "no trustworthy benchmark or profiler can run, stop with the commands tried, why evidence is insufficient, proxy checks if any, and the metric or fixture needed",
    finish:
      "a concise handoff listing baseline, final metric, changed files, correctness verification, tradeoffs, and remaining opportunities",
    questions: [
      "Which metric matters most: p95 latency, throughput, memory, startup time, bundle size, or something else?",
      "What benchmark, trace, or production signal should be treated as authoritative?",
    ],
    notes: [],
  },
  research: {
    outcome: (idea) => `Produce an evidence-backed research audit for ${subjectForType(idea, "research")}`,
    deliverables:
      "a claim inventory, evidence map, feasible reproductions or checks, and a final report that separates confirmed evidence, approximate evidence, blocked claims, and remaining uncertainty",
    verification:
      "source materials, local reproductions where feasible, citations or file evidence, generated artifacts, and a claim-by-claim ledger",
    constraints:
      "epistemic honesty, source attribution, clear uncertainty labels, and no overclaiming proxy evidence as exact proof",
    boundaries:
      "provided materials, local resources, official or primary sources where current facts matter, and scripts/artifacts created to test claims",
    iteration:
      "extract claims first, rank them by importance and verifiability, gather primary evidence, run feasible local checks, label evidence strength, and choose the next action that reduces the most important uncertainty",
    blocked:
      "source data, seeds, proprietary materials, credentials, or compute are unavailable, stop with the affected claims, evidence gathered, why exact verification is blocked, and what would unlock it",
    finish:
      "a concise report with confirmed findings, approximate support, blocked claims, remaining uncertainty, artifacts produced, and verification commands run",
    questions: [
      "Which source materials, datasets, or claims are in scope?",
      "What counts as enough evidence: exact reproduction, approximate support, or a documented audit of uncertainty?",
    ],
    notes: [],
  },
  vague: {
    outcome: (idea) => `Turn the vague request "${idea}" into a concrete, verifiable outcome before implementation`,
    deliverables:
      "a tightened scope, proposed success criteria, likely verification surfaces, and a ready-to-run follow-up goal once the user confirms the missing decision",
    verification:
      "explicit user confirmation of the tightened outcome plus a named test, build, benchmark, artifact, screenshot, report, or command that can prove completion",
    constraints:
      "not inventing hidden scope, not making irreversible changes, preserving user-owned changes, and keeping uncertainty visible",
    boundaries:
      "the current workspace, the user-provided idea, any attached context, and lightweight inspection needed to propose safe options",
    iteration:
      "inspect available context, identify the smallest missing decision that materially changes success, propose 2-3 concrete interpretations, ask at most 3 clarifying questions, and generate the strongest goal possible from confirmed or clearly labeled assumptions",
    blocked:
      "the user cannot confirm the outcome or verification surface, stop with the best candidate goals, assumptions, and the exact decision needed",
    finish:
      "a concise handoff with the tightened goal, assumptions, questions, rejected vague interpretations, and next input needed",
    questions: [
      "What does better mean here: faster, easier to use, more reliable, more polished, or more complete?",
      "What evidence should prove the result: tests, screenshots, benchmark, report, or a working artifact?",
      "What must not change while improving it?",
    ],
    notes: [
      "The idea is too broad as written; the coach should tighten it before asking Codex to work for a long time.",
      "A verification surface is required before this becomes a reliable active goal.",
    ],
  },
};

function classifyIdea(idea) {
  const normalized = normalizeIdea(idea);
  if (/^(make|improve|fix)?\s*(this|it|things|stuff)\s*(better|good|great)?$/i.test(normalized)) {
    return "vague";
  }

  for (const rule of TYPE_RULES) {
    if (rule.pattern.test(normalized)) {
      return rule.type;
    }
  }

  return normalized.split(/\s+/).length < 4 ? "vague" : "feature";
}

function coachIdea(idea, options = {}) {
  const cleanIdea = normalizeIdea(idea);
  const type = options.type || classifyIdea(cleanIdea);
  const profile = TYPE_PROFILES[type] || TYPE_PROFILES.feature;
  const assumptions = buildAssumptions(type, cleanIdea, options);
  const clarifyingQuestions = selectClarifyingQuestions(profile, options);
  const tighteningNotes = [...profile.notes];
  const goal = buildGoal(cleanIdea, profile, assumptions, options);
  const evaluation = evaluateGoal(goal);
  const text = renderCoachOutput({
    goal,
    assumptions,
    clarifyingQuestions,
    tighteningNotes,
    evaluation,
  });

  return {
    idea: cleanIdea,
    type,
    goal,
    assumptions,
    clarifyingQuestions,
    tighteningNotes,
    evaluation,
    text,
  };
}

function evaluateGoal(goal) {
  const missing = REQUIRED_GOAL_CHECKS.filter((check) => !check.test(goal)).map((check) => check.name);

  return {
    passes: missing.length === 0,
    missing,
    checked: REQUIRED_GOAL_CHECKS.map((check) => check.name),
  };
}

function normalizeIdea(idea) {
  const cleanIdea = String(idea || "")
    .trim()
    .replace(/^(use\s+)?goal-prompt-coach\s*:\s*/i, "")
    .replace(/\s+/g, " ");
  if (!cleanIdea) {
    return "make this better";
  }
  return cleanIdea.replace(/[.?!]+$/, "");
}

function subjectForType(idea, type) {
  let subject = normalizeIdea(idea);

  if (type === "feature") {
    subject = subject.replace(/^(add|implement|support|enable|integrate|extend)\s+/i, "");
  } else if (type === "bugfix") {
    subject = subject.replace(/^(fix|debug|repair|resolve)\s+/i, "");
  } else if (type === "frontend_app") {
    subject = subject.replace(/^(build|create|make|design)\s+(a|an|the)?\s*/i, "");
  } else if (type === "performance") {
    subject = subject
      .replace(/^(make|improve|optimize|speed up)\s+/i, "")
      .replace(/\s+(faster|perform better|less slow)$/i, "");
  } else if (type === "research") {
    subject = subject.replace(/^(research|investigate|audit|reproduce)\s+/i, "");
  }

  return subject.trim() || normalizeIdea(idea);
}

function buildAssumptions(type, idea, options) {
  const assumptions = [];
  const hasWorkspaceContext = Boolean(options.workspaceContext);

  assumptions.push(
    hasWorkspaceContext
      ? `Use the provided workspace context: ${options.workspaceContext}`
      : "Codex should inspect the current workspace before choosing files, commands, or implementation details"
  );

  if (type === "frontend_app") {
    assumptions.push("The requested app should open to the usable product experience, not a marketing landing page");
  } else if (type === "research") {
    assumptions.push("Primary sources and explicit uncertainty labels matter more than producing a confident-sounding answer");
  } else if (type === "performance") {
    assumptions.push("If no metric is provided, p95 latency is a provisional target until a better benchmark is found");
  } else if (type === "bugfix") {
    assumptions.push("A regression test or reproduction command should be created before claiming the bug is fixed");
  } else if (type === "vague") {
    assumptions.push(`The phrase "${idea}" does not define a safe completion condition by itself`);
  } else {
    assumptions.push("The feature should follow existing project conventions and avoid unrelated refactors");
  }

  if (Array.isArray(options.assumptions)) {
    assumptions.push(...options.assumptions.filter(Boolean));
  }

  return assumptions;
}

function selectClarifyingQuestions(profile, options) {
  if (Array.isArray(options.answers) && options.answers.length > 0) {
    return [];
  }

  const questions = Array.isArray(options.questions) ? options.questions : profile.questions;
  return questions.slice(0, 3);
}

function buildGoal(idea, profile, assumptions, options) {
  const target = typeof profile.outcome === "function" ? profile.outcome(idea) : profile.outcome;
  const verification = options.verification || profile.verification;
  const constraints = options.constraints || profile.constraints;
  const boundaries = options.boundaries || profile.boundaries;
  const deliverables = options.deliverables || profile.deliverables;

  return [
    `/goal ${target}. Deliver ${deliverables}, verified by ${verification}, while preserving ${constraints}.`,
    `Use ${boundaries}. Encode Codex best practices: inspect real context before editing, prefer existing repo patterns, use \`rg\` for search, batch independent reads, use \`apply_patch\` for manual edits, avoid destructive git commands, preserve user changes, and verify before claiming completion.`,
    `Between iterations, ${profile.iteration}. If blocked, ${profile.blocked}. Finish with ${profile.finish}.`,
    `Do not mark the goal complete until the current evidence proves every explicit requirement, deliverable, constraint, and verification surface is satisfied.`,
  ].join(" ");
}

function renderCoachOutput({ goal, assumptions, clarifyingQuestions, tighteningNotes, evaluation }) {
  const questionLines =
    clarifyingQuestions.length > 0
      ? clarifyingQuestions.map((question, index) => `${index + 1}. ${question}`)
      : ["None needed from the current idea."];

  const noteLines =
    tighteningNotes.length > 0
      ? tighteningNotes.map((note) => `- ${note}`)
      : ["- The idea is specific enough to draft a usable first goal with labeled assumptions."];

  const evaluationLines = [
    `- Passes checklist: ${evaluation.passes ? "yes" : "no"}`,
    `- Checked: ${evaluation.checked.join(", ")}`,
    `- Missing: ${evaluation.missing.length > 0 ? evaluation.missing.join(", ") : "none"}`,
  ];

  return [
    "## /goal Prompt",
    goal,
    "",
    "## Assumptions",
    ...assumptions.map((assumption) => `- ${assumption}`),
    "",
    "## Clarifying Questions",
    ...questionLines,
    "",
    "## Tightening Notes",
    ...noteLines,
    "",
    "## Evaluation",
    ...evaluationLines,
    "",
  ].join("\n");
}

module.exports = {
  REQUIRED_GOAL_CHECKS,
  REQUIRED_OUTPUT_SECTIONS,
  coachIdea,
  classifyIdea,
  evaluateGoal,
};
