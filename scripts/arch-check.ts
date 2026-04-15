/**
 * mechanical enforcer: verifies structural invariant (Types -> Config -> Repo -> UI)
 * dependencies can only flow one way.
 */
import { spawnSync } from "child_process";

const VIOLATIONS = [
  {
    target: "app/models",
    forbidden: ["app/projects", "app/components", "app/api"],
    label: "Types cannot depend on Repository or UI"
  },
  {
    target: "app/projects",
    forbidden: ["app/components", "app/api"],
    label: "Repository cannot depend on UI"
  }
];

function checkViolations() {
  let hasError = false;

  for (const { target, forbidden, label } of VIOLATIONS) {
    for (const pattern of forbidden) {
      const result = spawnSync("grep", ["-r", `@/${pattern}`, target], { encoding: "utf-8" });
      
      if (result.stdout) {
        console.error(`\x1b[31m[ARCH CHECK FAILURE]: ${label}\x1b[0m`);
        console.error(`Violation in ${target}: found imports from @/${pattern}`);
        console.error(result.stdout);
        hasError = true;
      }
    }
  }

  if (hasError) {
    process.exit(1);
  } else {
    console.log("\x1b[32m[ARCH CHECK PASSED]: structural invariants maintained\x1b[0m");
  }
}

checkViolations();
