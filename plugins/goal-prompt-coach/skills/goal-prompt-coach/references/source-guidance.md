# Source Guidance Distillation

This plugin incorporates the two source documents as references and behavior:

- `codex-prompting-guide.md`: the Codex Prompting Guide.
- `using-goals-in-codex.md`: Using Goals in Codex.

## Codex Prompting Guide Rules

- Bias toward action: inspect context, implement when asked, test, and report concrete outcomes.
- Prefer existing repository patterns and focused edits over speculative rewrites.
- Use `rg` or `rg --files` for search when available.
- Batch independent reads and searches when possible.
- Use `apply_patch` for manual file edits.
- Preserve user changes and avoid destructive git commands.
- Verify before claiming completion.
- For frontend work, require a complete usable experience and browser-based visual verification when feasible.

## Using Goals In Codex Rules

- A strong `/goal` is a scoped completion contract, not a bigger vague prompt.
- The completion contract should define auditable completion: what proves done, what preserves safety, and when to stop as blocked.
- Include a desired end state, verification surface, constraints, boundaries, iteration policy, blocked stop condition, and final reporting expectations.
- Completion must be evidence-based: evidence-based completion means tests, benchmarks, screenshots, generated artifacts, source evidence, or a claim ledger decide whether the goal is done.
- When exact verification is unavailable, label approximate evidence and blocked claims honestly.
- Research goals should separate confirmed findings, approximate support, blocked claims, and remaining uncertainty.
- Budget or blocker stops are not completion; report the evidence gathered and what would unlock progress.

## Autonomous-Loop Failure Modes To Prevent

- Halting for confirmation: include an iteration policy that tells Codex how to continue and when stopping is justified.
- Infinite loops: include a verification surface and done criteria Codex can audit.
- Plausible-but-wrong output: require Codex to verify by observation before claiming completion.

## Evaluable Success Conditions

Each condition should be something Codex can confirm by doing, not believing. Prefer commands, files, artifacts, logs, screenshots, metrics, or claim ledgers over subjective language.

Examples:

- "Make the app faster" should become a baseline plus target metric, such as p95 latency, LCP, or benchmark time.
- "Add tests" should become a named test command and expected exit status.
- "Document it" should become a file path plus required sections and example commands that run.
- "Research this" should become a report or ledger where claims are sourced, marked unknown, or labeled blocked.

## Goal Prompt Coach Behavior

The coach should:

- generate a ready-to-paste `/goal`,
- label assumptions,
- ask at most 3 material clarifying questions,
- tighten vague ideas instead of pretending they are auditable,
- include an evaluation checklist for the goal contract,
- preserve the original source guidance in generated goal wording,
- never build the thing described by the user,
- keep the generated `/goal` itself under 4000 characters when manually editing output.

Important phrase inventory for output checks:

- `verified by`
- `while preserving`
- `Between iterations`
- `If blocked`
- `Finish with`
- `inspect real context`
- `rg`
- `apply_patch`
- `browser interaction`
- `desktop and mobile screenshots`
- `p95 latency`
- `claim-by-claim ledger`
- `confirmed evidence`
- `approximate evidence`
- `blocked claims`
- `remaining uncertainty`
