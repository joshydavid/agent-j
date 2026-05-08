<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

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
- **Language**: TypeScript (Strict mode)

## Portfolio-Specific Guidelines

- **Visual Style**: Minimalist, modern, and developer-centric. Use subtle animations (e.g., Framer Motion) for page transitions.
- **Project Showcases**: Use a structured layout for project entries including: Title, Tech Stack (icons preferred), Description, and GitHub/Live Demo links.
- **Content Management**: If data is static, keep it in a central `config/portfolio.ts` file for easy updates.
- **Performance**: Ensure high [Lighthouse scores](https://web.dev) by optimizing images and leveraging Next.js Font optimization.

## Coding Standards

- **Server Components**: Default to RSC. Use `'use client'` only for interactive UI (e.g., mobile nav toggle, contact form, or theme switcher).
- **shadcn/ui**: Use `bun x shadcn@latest add [component]` for all base UI elements.
- **Icons**: Use `lucide-react` for general icons and simple `svg` components for brand-specific tech logos.

## Execution Rules

- Always use `bun` (e.g., `bun dev`, `bun add`) for terminal commands.
- Provide "copy-paste ready" code that integrates seamlessly with existing `components/ui/` from shadcn.
- Prioritize accessibility (A11y) to ensure the portfolio is navigable by screen readers.

## Quality Gate

Before submitting code, execute via Bun:

1. **Arch Check:** `bun scripts/arch-check.ts` (Structural Invariant verification).
2. **Lint Check**: `bun x eslint . --fix` (Style compliance).
3. **Type Check**: `bun run check:types` (Next.js 16 async type and unused import verification).
4. **Build Check**: `bun run build` (Production validation).
5. **Git Check:** `bun scripts/check-git.ts` (Conventional commit verification).

## Git Conventions

- Commit Message Format: Follow [Conventional Commits](https://conventionalcommits.org).
  - Format: `<type>(<scope>): <description>` (e.g., `feat(ui): add navbar with shadcn`)
- Common Types:
  - `feat`: A new feature (e.g., adding a "Projects" section).
  - `fix`: A bug fix.
  - `docs`: Documentation changes only.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `chore`: Updating build tasks, package manager configs, etc.
- Branching Strategy: Use `master` for production and `feat/feature-name` for active development.
