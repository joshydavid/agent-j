/**
 * mechanical enforcer: verifies structural invariant (Models -> Repositories -> UI)
 * dependencies can only flow one way.
 */
import { spawnSync } from "child_process";

const VIOLATIONS = [
  {
    target: "app/models",
    forbidden: ["app/projects", "app/blog", "app/components", "app/api", "app/providers"],
    label: "Models (Types) cannot depend on Repositories, UI, or API"
  },
  {
    target: "app/projects",
    forbidden: ["app/components", "app/api", "app/providers", "app/blog"],
    label: "Project Repository cannot depend on UI, API, or other Repositories"
  },
  {
    target: "app/blog",
    forbidden: ["app/components", "app/api", "app/providers", "app/projects"],
    label: "Blog Repository cannot depend on UI, API, or other Repositories"
  },
  {
    target: "app/constants",
    forbidden: ["app/projects", "app/blog", "app/components", "app/api", "app/providers"],
    label: "Constants cannot depend on Repositories, UI, or API"
  }
];

function checkViolations() {
  let hasError = false;

  console.log("\x1b[34m[ARCH CHECK]: verifying structural invariants...\x1b[0m");

  for (const { target, forbidden, label } of VIOLATIONS) {
    for (const pattern of forbidden) {
      // Use grep to find imports starting with @/ or relative imports that might violate boundaries
      // We focus on @/ patterns as they are standard in this project's tsconfig
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
