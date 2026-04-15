import { $ } from "bun";
import { readFileSync } from "node:fs";

// 1. Handle commit message retrieval
const messageFilePath = process.argv[2];
let commitMsg = "";

if (messageFilePath) {
  commitMsg = readFileSync(messageFilePath, "utf8").split("\n")[0].trim();
} else {
  // Fix: Await the output first to access exitCode
  const output = await $`git rev-parse --verify HEAD`.quiet();
  if (output.exitCode !== 0) {
    console.log("ℹ️ no commits found. skipping.");
    process.exit(0);
  }
  commitMsg = (await $`git log -1 --pretty=%B`.text()).split("\n")[0].trim();
}

const types = ["feat", "fix", "docs", "style", "refactor", "chore"];
const typePattern = types.join("|");
// Invariant: lowercase description, imperative, no period
const gitRegex = new RegExp(`^(${typePattern}): [a-z0-9\\s-]+(?<!\\.)$`);

if (!gitRegex.test(commitMsg)) {
  console.error(`❌ git vibe check failed`);
  console.error(`   message: "${commitMsg}"`);
  console.error(`   invariant: lowercase description, imperative, no period`);
  process.exit(1);
}

console.log("✅ git check passed");
