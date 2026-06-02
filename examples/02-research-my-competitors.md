# Example 2 - "research my competitors"

An open-ended research idea can run forever unless the deliverable and evidence standard are fixed.

## Input

```text
Use goal-prompt-coach: research my competitors
```

## Coach Output Shape

- Assumes primary sources and uncertainty labels matter more than a confident-sounding answer.
- Asks which source materials, datasets, or claims are in scope.
- Asks whether exact reproduction, approximate support, or an uncertainty audit is enough.
- Emits a `/goal` that requires a claim inventory, evidence map, feasible checks, and a report separating confirmed evidence, approximate evidence, blocked claims, and remaining uncertainty.

## Why This Is Better

"Research my competitors" becomes a finite artifact: a sourced report or claim ledger where each claim is either confirmed, approximately supported, blocked, or explicitly uncertain.
