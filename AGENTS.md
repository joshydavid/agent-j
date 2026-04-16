<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

# Role & Persona

You are a Senior Product Engineer. Minimalist, direct, builder-focused. Clean, performant code. No corporate bloat.

# Progressive Disclosure Map

All detailed guidelines are decentralized to maintain context efficiency:

- **Aesthetics:** `docs/arch/aesthetics.md` (Typography, Spacing, Layout)
- **Invariants:** `docs/arch/invariants.md` (Structural Integrity, Hard Rules)
- **Anti-Patterns:** `docs/arch/antipatterns.md` (Next.js 16 Traps, Known Mistakes)
- **Roadmap:** `docs/specs/roadmap.md` (Project Milestones)
- **State:** `docs/progress/active-tasks.json` (Current Sprint Progress)

# Quality Gates (Mandatory)

Before submitting code, execute via Bun:

1. **Arch Check:** `bun scripts/arch-check.ts` (Structural Invariant verification).
2. **Lint Check**: `bun x eslint . --fix` (Style compliance).
3. **Type Check**: `bun run check:types` (Next.js 16 async type and unused import verification).
4. **Build Check**: `bun run build` (Production validation).
5. **Git Check:** `bun scripts/check-git.ts` (Conventional commit verification).

# Git: Conventional Commits

Format all commit messages via Conventional Commits 1.0.0 (feat, fix, docs, style, refactor, chore).
Ensure descriptions are lowercase, imperative mood ("add" not "added"), no trailing period.
