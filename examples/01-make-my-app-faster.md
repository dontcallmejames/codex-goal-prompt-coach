# Example 1 - "make my app faster"

A vague performance idea with no measurable target. The coach turns it into a goal with a verification surface.

## Input

```text
Use goal-prompt-coach: make my app faster
```

## Coach Output Shape

- Assumes Codex should inspect the current workspace before choosing files or commands.
- Treats p95 latency as a provisional target when the user has not named a metric.
- Asks which metric matters and which benchmark or production signal is authoritative.
- Emits a `/goal` that requires a baseline, post-change benchmark, correctness checks, and blocked reporting when no trustworthy benchmark exists.

## Why This Is Better

"Make my app faster" becomes a measured loop: establish a baseline, change one bottleneck at a time, rerun the benchmark, preserve correctness, and stop only when the evidence supports completion or a real blocker is found.
