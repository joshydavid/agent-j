import { $ } from "bun";
import { readFileSync } from "node:fs";

// 1. Handle commit message retrieval
const messageFilePath = process.argv[2];
let fullCommitMsg = "";

if (messageFilePath) {
  fullCommitMsg = readFileSync(messageFilePath, "utf8").trim();
} else {
  const output = await $`git rev-parse --verify HEAD`.quiet();
  if (output.exitCode !== 0) {
    console.log("ℹ️ no commits found. skipping.");
    process.exit(0);
  }
  fullCommitMsg = (await $`git log -1 --pretty=%B`.text()).trim();
}

if (!fullCommitMsg) {
  console.error("❌ commit message is empty");
  process.exit(1);
}

const lines = fullCommitMsg.split("\n");
const header = lines[0].trim();

const types = ["feat", "fix", "docs", "style", "refactor", "chore", "perf", "test", "build", "ci"];
const typePattern = types.join("|");

// Invariant: type(optional scope): lowercase description, imperative, no period
// Example: feat(ui): add new button
// Example: fix: resolve crash in auth
const gitRegex = new RegExp(`^(${typePattern})(\\([a-z0-9-]+\\))?: [a-z0-9\\s\\._/-]+(?<!\\.)$`);

let hasError = false;

// 1. Header Format Check
if (!gitRegex.test(header)) {
  console.error(`❌ git vibe check failed: header format`);
  console.error(`   header: "${header}"`);
  console.error(`   invariant: <type>(scope?): lowercase description, imperative, no period`);
  console.error(`   allowed types: ${types.join(", ")}`);
  hasError = true;
}

// 2. Header Length Check
if (header.length > 72) {
  console.error(`❌ git vibe check failed: header too long`);
  console.error(`   length: ${header.length} (max 72)`);
  hasError = true;
}

// 3. Body Separation Check
if (lines.length > 1 && lines[1].trim() !== "") {
  console.error(`❌ git vibe check failed: missing blank line after header`);
  hasError = true;
}

if (hasError) {
  process.exit(1);
}

console.log("✅ git check passed");
