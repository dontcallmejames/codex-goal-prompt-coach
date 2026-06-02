# Proof Run - Goal Prompt Coach

This proof run uses a fresh idea and shows the plugin producing a paste-ready Codex `/goal` contract.

## Input

```text
Use goal-prompt-coach: a little CLI that renames my photos by the date they were taken
```

## Representative Output

The coach classifies this as a feature idea and emits a `/goal` that should include:

- a concrete CLI deliverable,
- tests or manual commands that prove dry-run and apply behavior,
- constraints such as no overwrites and clear fallback behavior,
- an iteration policy to run tests and fix failures,
- a blocked condition for missing sample images or unavailable EXIF tooling,
- a final handoff listing commands run and residual risks.

## Verification Notes

The plugin test harness verifies representative feature, bugfix, frontend app, performance, research, and vague inputs. It also checks every generated goal has a verification surface, constraints, boundaries, iteration policy, blocked stop condition, and final reporting expectations.
