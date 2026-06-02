# Codex Goal Prompt Coach

Codex Goal Prompt Coach is a shareable Codex plugin marketplace for installing `goal-prompt-coach`.

The plugin turns rough ideas into strong, ready-to-paste Codex `/goal` prompts with assumptions, clarifying questions, verification surfaces, constraints, iteration policy, blocked stop conditions, and final handoff expectations.

## Install

```bash
codex plugin marketplace add dontcallmejames/codex-goal-prompt-coach --ref main
codex plugin add goal-prompt-coach@dontcallmejames
```

Then start a new Codex thread and try:

```text
Use goal-prompt-coach: make my app faster
```

## Marketplace Layout

- `.agents/plugins/marketplace.json`
- `plugins/goal-prompt-coach`

The plugin behavior is distilled from the Codex Prompting Guide and Using Goals in Codex, both bundled as references inside the plugin.
