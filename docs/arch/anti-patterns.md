# Hall of Shame (Anti-Patterns)

This file tracks coding patterns that are strictly forbidden. These patterns have historically caused build failures or violated the project's aesthetic invariants.

---

## I. Next.js 16 Async Patterns
* **The Mistake:** Treating `params` or `searchParams` as plain objects.
* **The Fix:** Always type as `Promise<{ slug: string }>` and `await` before destructuring.
* **Reason:** Next.js 16 throws a runtime error if dynamic route headers are accessed synchronously.

## II. Module Import Errors
* **The Mistake:** Using relative paths `../../` or incorrect `@/` aliases for app-directory files.
* **The Fix:** Use the `@/app/` prefix for all files inside the app directory (e.g., `@/app/projects/data`).
* **Reason:** Ensures path resolution consistency across the monorepo structure.

## III. Case Sensitivity
* **The Mistake:** Capitalizing UI labels (e.g., "Projects", "About Me").
* **The Fix:** Use strictly lowercase strings (e.g., "projects", "about").
* **Reason:** Invariant-01: The builder aesthetic requires a minimalist, lowercase UI.

## IV. Unused Imports & Variables
* **The Mistake:** Leaving unused `import` statements or declared variables in the code.
* **The Fix:** Remove dead code manually or run `bun x eslint . --fix` before committing.
* **Reason:** Increases bundle size and creates "dead code" noise that degrades agent performance.

## V. Unorganized Imports
* **The Mistake:** Mixing local, third-party, and framework imports without structure.
* **The Fix:** Sort imports alphabetically and group by category: 1. Next/React, 2. Dependencies, 3. Internal Aliases (`@/`).
* **Reason:** Maintains scannability and prevents merge conflicts during autonomous refactors.

## VI. State Neglect
* **The Mistake:** Completing a task and committing without updating `active-tasks.json`.
* **The Fix:** The very last action of every task must be a state update in the progress ledger.
* **Reason:** Breaks session continuity and leads to instruction drift.
