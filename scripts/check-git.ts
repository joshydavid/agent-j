import { $ } from "bun";

// 1. Check if any commits exist
const commitCount = parseInt(await $`git rev-list --count HEAD 2>/dev/null || echo 0`.text());

if (commitCount === 0) {
  console.log("ℹ️ no commits found. skipping git vibe check for initialization.");
  process.exit(0);
}

// 2. Grab the latest commit message
const commitMsg = (await $`git log -1 --pretty=%B`.text()).trim();

// 3. Define allowed types from agents.md
const types = ["feat", "fix", "docs", "style", "refactor", "chore"];
const typePattern = types.join("|");

// 4. Regex: type: lowercase description (imperative, no period)
const gitRegex = new RegExp(`^(${typePattern}): [a-z0-9\\s-]+(?<!\\.)$`);

if (!gitRegex.test(commitMsg)) {
  console.error(`❌ git vibe check failed`);
  console.error(`   message: "${commitMsg}"`);
  process.exit(1);
}

console.log("✅ git check passed");
