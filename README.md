# Codex Goal Prompt Coach

Turn a rough idea into a strong, ready-to-paste Codex `/goal` prompt.

`/goal` gives Codex a persistent objective: it works, checks the evidence, and keeps the objective in view until the work is complete, blocked, paused, cleared, or stopped by budget. The catch: most weak goals fail because "done" is not something Codex can actually verify. This plugin coaches the rough idea into a `/goal` prompt with a concrete outcome, verification surface, constraints, iteration policy, blocked stop condition, and final handoff expectations.

This is the Codex counterpart to [Claude Goal Prompt Coach](https://github.com/dontcallmejames/claude-goal-prompt-coach).

## What You Get

- A Codex plugin marketplace that installs `goal-prompt-coach`.
- A skill that triggers when you ask to turn an idea into a Codex `/goal`.
- A deterministic helper script used by the skill for consistent output.
- Bundled references from the Codex Prompting Guide and Using Goals in Codex.

The plugin does not build the thing you described. Its job is only to produce the prompt you paste into `/goal`.

## Install

```bash
codex plugin marketplace add dontcallmejames/codex-goal-prompt-coach --ref main
codex plugin add goal-prompt-coach@dontcallmejames
```

To pin the public-ready release:

```bash
codex plugin marketplace add dontcallmejames/codex-goal-prompt-coach --ref v1.0.0
codex plugin add goal-prompt-coach@dontcallmejames
```

Then start a new Codex thread and try:

```text
Use goal-prompt-coach: make my app faster
```

## What a Good `/goal` Prompt Contains

Every generated prompt is checked for:

- desired end state,
- concrete deliverables,
- verification surface,
- constraints that must not regress,
- boundaries for files, tools, sources, or context,
- iteration policy,
- blocked stop condition,
- final reporting expectations.

The heart of the prompt is the verification surface. The coach rewrites "make it faster" into something Codex can check, such as a baseline plus a p95/Lighthouse/benchmark target, or "research this" into a claim-by-claim evidence ledger.

## Worked Examples

- [Make my app faster](examples/01-make-my-app-faster.md)
- [Research my competitors](examples/02-research-my-competitors.md)
- [Proof run](examples/03-proof-run.md)

## How It Works

```text
.agents/plugins/marketplace.json
plugins/goal-prompt-coach/
  .codex-plugin/plugin.json
  skills/goal-prompt-coach/
    SKILL.md
    agents/openai.yaml
    examples/transformations.md
    references/
      codex-prompting-guide.md
      source-guidance.md
      using-goals-in-codex.md
    scripts/
      promptCoach.js
      run.js
```

## License

MIT - see [LICENSE](LICENSE).
