const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");

const pluginRoot = path.resolve(__dirname, "..");
const skillRoot = path.join(pluginRoot, "skills", "goal-prompt-coach");
const { coachIdea, evaluateGoal } = require(path.join(skillRoot, "scripts", "promptCoach"));

const samples = [
  ["feature", "Add saved filters to the issue dashboard"],
  ["bugfix", "Fix this flaky checkout test"],
  ["frontend_app", "Build a dashboard for tracking household chores"],
  ["performance", "Make my app faster"],
  ["research", "Research whether this paper's results can be reproduced"],
  ["vague", "Make this better"],
];

function read(relativePath) {
  return fs.readFileSync(path.join(pluginRoot, relativePath), "utf8");
}

describe("goal-prompt-coach plugin", () => {
  it("metadata makes the /goal-specific purpose obvious", () => {
    const plugin = JSON.parse(read(".codex-plugin/plugin.json"));
    const metadata = [
      plugin.name,
      plugin.description,
      plugin.interface.displayName,
      plugin.interface.shortDescription,
      plugin.interface.longDescription,
      plugin.interface.defaultPrompt,
    ].join("\n");

    assert.equal(plugin.name, "goal-prompt-coach");
    assert.match(metadata, /\/goal/i);
    assert.match(metadata, /ready-to-paste/i);
    assert.match(metadata, /rough ideas/i);
  });

  it("includes the original source guides as references", () => {
    const promptingGuide = read("skills/goal-prompt-coach/references/codex-prompting-guide.md");
    const goalsGuide = read("skills/goal-prompt-coach/references/using-goals-in-codex.md");
    const distilled = read("skills/goal-prompt-coach/references/source-guidance.md");

    assert.match(promptingGuide, /Codex.*Prompting Guide/);
    assert.match(promptingGuide, /gpt-5\.3-codex/);
    assert.match(goalsGuide, /Using Goals in Codex/);
    assert.match(goalsGuide, /persistent objectives/i);
    assert.match(distilled, /auditable completion/i);
    assert.match(distilled, /evidence-based completion/i);
  });

  it("generates checklist-passing goals for representative sample ideas", () => {
    for (const [expectedType, idea] of samples) {
      const result = coachIdea(idea);

      assert.equal(result.type, expectedType, idea);
      assert.equal(result.goal.startsWith("/goal "), true, idea);
      assert.equal(result.clarifyingQuestions.length <= 3, true, idea);
      assert.equal(result.evaluation.passes, true, idea);
      assert.match(result.text, /^## \/goal Prompt$/m, idea);
      assert.match(result.text, /^## Assumptions$/m, idea);
      assert.match(result.text, /^## Clarifying Questions$/m, idea);
      assert.match(result.text, /^## Tightening Notes$/m, idea);
      assert.match(result.text, /^## Evaluation$/m, idea);
    }
  });

  it("bakes Codex and Goals guide practices into generated goals", () => {
    const feature = coachIdea("Add saved filters to the issue dashboard").goal;
    const frontend = coachIdea("Build a dashboard for tracking household chores").goal;
    const performance = coachIdea("Make my app faster").goal;
    const research = coachIdea("Research whether this paper's results can be reproduced").goal;
    const vague = coachIdea("Make this better").text;

    for (const term of ["inspect real context", "`rg`", "batch independent reads", "`apply_patch`", "avoid destructive git commands", "preserve user changes", "verify before claiming completion"]) {
      assert.match(feature, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), term);
    }

    assert.match(frontend, /browser interaction/i);
    assert.match(frontend, /desktop and mobile screenshots/i);
    assert.match(frontend, /accessible/i);
    assert.match(performance, /p95 latency/i);
    assert.match(performance, /baseline and post-change benchmark/i);
    assert.match(research, /confirmed evidence/i);
    assert.match(research, /approximate evidence/i);
    assert.match(research, /blocked claims/i);
    assert.match(research, /remaining uncertainty/i);
    assert.match(vague, /too broad/i);
    assert.match(vague, /verification surface/i);
  });

  it("strips the skill invocation prefix from user ideas", () => {
    const result = coachIdea("Use goal-prompt-coach: make my app faster");

    assert.equal(result.type, "performance");
    assert.match(result.goal, /^\/goal Improve performance for my app\./);
    assert.doesNotMatch(result.goal, /Use goal-prompt-coach/i);
  });

  it("rejects weak goals that lack the auditable contract", () => {
    const evaluation = evaluateGoal("/goal Make this better");

    assert.equal(evaluation.passes, false);
    assert.ok(evaluation.missing.includes("verification surface"));
    assert.ok(evaluation.missing.includes("blocked stop condition"));
  });
});
