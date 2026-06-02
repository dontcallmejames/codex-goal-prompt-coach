# Example Transformations

These examples should continue to pass the plugin test harness.

## Feature

Input: `Add saved filters to the issue dashboard`

Expected: a `/goal` for implementing saved filters, with tests, existing repo patterns, `rg`, `apply_patch`, user-change preservation, and focused verification.

## Bugfix

Input: `Fix this flaky checkout test`

Expected: a `/goal` that requires reproduction, a regression test, affected-suite verification, and an honest blocked condition if the failure cannot be reproduced.

## Frontend App

Input: `Build a dashboard for tracking household chores`

Expected: a `/goal` that requires a usable app experience, responsive layout, accessible states, browser interaction, desktop and mobile screenshots, and no landing-page-only substitute.

## Performance

Input: `Make my app faster`

Expected: a `/goal` that requires a baseline, p95 or other repeatable metric, one measured experiment at a time, post-change benchmark, and correctness checks.

## Research

Input: `Research whether this paper's results can be reproduced`

Expected: a `/goal` that requires a claim inventory, source evidence, local checks where feasible, and a report separating confirmed evidence, approximate evidence, blocked claims, and remaining uncertainty.

## Vague Idea

Input: `Make this better`

Expected: a `/goal` that flags the idea as too broad, asks up to 3 material questions, and requires a verification surface before long-running work starts.
