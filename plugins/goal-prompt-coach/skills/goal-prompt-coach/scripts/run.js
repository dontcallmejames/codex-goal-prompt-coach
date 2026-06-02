#!/usr/bin/env node
"use strict";

const { coachIdea } = require("./promptCoach");

async function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }

  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function main() {
  const args = process.argv.slice(2);
  const idea = args.length > 0 ? args.join(" ") : await readStdin();

  if (!idea.trim()) {
    console.error("Usage: node scripts/run.js \"rough idea\"");
    process.exitCode = 1;
    return;
  }

  process.stdout.write(coachIdea(idea).text);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
