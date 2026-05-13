<!-- BEGIN:nextjs-agent-rules -->

# Next.js 16+ Development Protocol

This project uses Next.js 16+ with MANDATORY MCP integration.

1.  **Initialize First**: ALWAYS call `next-devtools.init({ project_path: "." })` at the start of every session.
2.  **Docs-First**: NEVER guess Next.js APIs. Use `next-devtools.nextjs_docs` for ALL queries. Read `nextjs-docs://llms-index` first.
3.  **Runtime Diagnostics**: Use `next-devtools.nextjs_index` and `nextjs_call` to inspect the running app before making changes.
4.  **Async APIs**: Be strictly compliant with async `params`, `searchParams`, `cookies()`, and `headers()`.
5.  **Cache Components**: This project is prepared for Cache Components. Use `"use cache"` where appropriate.

<!-- END:nextjs-agent-rules -->

# Project Context: Software Engineer Portfolio

## Overview

- This project is a **Personal Portfolio Showcase** for a Software Engineer.
- Goal: Highlight technical expertise, project history, and professional identity with a clean, high-performance UI.

## Core Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Runtime/Package Manager**: Bun (Use `bun` for all commands)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Server Components (RSC) by default.
- **Language**: TypeScript (Strict mode)

## Portfolio-Specific Guidelines

- **Visual Style**: Minimalist, modern, and developer-centric. Use subtle animations (e.g., Framer Motion) for page transitions.
- **Project Showcases**: Use a structured layout for project entries including: Title, Tech Stack (icons preferred), Description, and GitHub/Live Demo links.
- **Content Management**:
  - Static blog content: `content/blog/*.md`
  - Portfolio data: `app/projects/data.ts` and `app/blog/data.ts`
- **Performance**: Ensure high [Lighthouse scores](https://web.dev) by optimizing images and leveraging Next.js Font optimization. Use `nextjs_call` with `get_diagnostics` to verify performance.

## Coding Standards

- **Server Components**: Default to RSC. Use `'use client'` only for interactive UI (e.g., mobile nav toggle, contact form, or theme switcher).
- **shadcn/ui**: Use `bun x shadcn@latest add [component]` for all base UI elements.
- **Icons**: Use `lucide-react` for general icons and simple `svg` components for brand-specific tech logos.
- **Data Flow**: Strictly follow the unidirectional flow: `Models/Types -> Data/Repositories -> UI Components`.

## Execution Rules

- **Bun Priority**: Always use `bun` (e.g., `bun dev`, `bun add`) for terminal commands.
- **MCP Verification**: Use `browser_eval` to verify UI changes in a real browser context.
- **Accessibility**: Prioritize A11y. Use `browser_eval` to run accessibility audits if needed.

## Quality Gate (MANDATORY before every commit)

1.  **Arch Check**: `bun scripts/arch-check.ts` (Enforces structural invariants).
2.  **Lint Check**: `bun x eslint . --fix` (Style compliance).
3.  **Type Check**: `bun run check:types` (Next.js 16 async type and unused import verification).
4.  **Build Check**: `bun run build` (Production validation).
5.  **Git Check**: `bun scripts/check-git.ts` (Conventional commit verification).

## Git Conventions

- **Format**: `<type>(<scope>): <description>` (e.g., `feat(ui): add navbar with shadcn`)
- **Vibe Check**: Lowercase description, imperative mood, no period at the end.
- **Atomic Commits**: One logical change per commit.
- **Branching**: `master` (production), `feat/*` (development), `fix/*` (hotfixes).
