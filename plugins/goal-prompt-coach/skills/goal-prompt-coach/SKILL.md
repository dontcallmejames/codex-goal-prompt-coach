---
name: goal-prompt-coach
description: Create strong, ready-to-paste Codex `/goal` prompts from rough ideas. Use when the user asks to generate, draft, improve, tighten, or coach a `/goal`; says "use goal-prompt-coach"; wants a basic idea transformed into a goal command; or needs assumptions, clarifying questions, verification surfaces, constraints, iteration policy, blocked stop conditions, and Codex best-practice prompting.
---

# Goal Prompt Coach

Use this skill to turn a rough idea into a ready-to-paste Codex `/goal` prompt. This is specifically for Codex Goals, not general prompt writing.

## Fast Path

When the user gives a rough idea and wants a `/goal`, run:

```bash
node scripts/run.js "<rough idea>"
```

Return the script output directly unless the user asks for manual editing or a different format.

## Output Contract

Every response must include:

- `## /goal Prompt`
- `## Assumptions`
- `## Clarifying Questions`
- `## Tightening Notes`
- `## Evaluation`

Ask at most 3 clarifying questions. Ask only when missing information would materially change the outcome, verification method, safety constraints, or delivery surface. If a reasonable assumption keeps the user moving, make it and label it.

## Required Goal Ingredients

Every generated `/goal` should include, when applicable:

- desired end state,
- concrete deliverables,
- verification surface,
- constraints that must not regress,
- allowed files, tools, inputs, sources, or boundaries,
- iteration policy,
- blocked stop condition,
- final reporting expectations.

## Baked-In Source Guidance

The behavior is distilled from:

- `references/codex-prompting-guide.md`
- `references/using-goals-in-codex.md`
- `references/source-guidance.md`

The bundled script already encodes the durable rules. Read the references when you need to adapt the output manually, update the script, or explain why a goal is structured a certain way.

Preserve these practices in generated goals:

- inspect real context before editing,
- prefer existing repo patterns,
- use `rg` for search,
- batch independent reads,
- use `apply_patch` for manual edits,
- avoid destructive git commands,
- preserve user changes,
- implement when implementation is requested,
- verify before claiming completion,
- report blockers honestly,
- separate confirmed evidence, approximate support, blocked claims, and remaining uncertainty for research or audits.

For frontend or app ideas, require a complete usable experience, browser or dev-server verification, desktop and mobile screenshots, responsive behavior, accessible states, and no landing-page-only substitute unless explicitly requested.

For vague ideas, tighten scope before implementation. Include assumptions, candidate interpretations, up to 3 material questions, and a named verification surface requirement.
