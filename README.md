# Agent J 🤖

**Agent J** is a high-performance, agent-driven portfolio and development environment built at the intersection of cloud-native infrastructure and agentic AI. It serves as both a personal showcase and a rigorous testing ground for autonomous engineering workflows.

## ⚡ Core Philosophy

- **Agent-First Maintenance**: The codebase is primarily managed by specialized AI personas following strict architectural invariants.
- **Bleeding Edge**: Built with the latest primitives from the Next.js and React ecosystems.
- **Radical Transparency**: Every decision, from architectural patterns to commit messages, is governed by explicit guidelines in `docs/arch/` and `.agents/skills/`.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (Fastest package manager & bundler)
- **Framework**: [Next.js 16 (Canary)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Infrastructure**: Vercel (Analytics & Speed Insights)
- **Content**: Markdown-driven blog with Gray Matter

## 🤖 Agent Intelligence

The repository includes a comprehensive library of **25+ specialized agent skills** located in `.agents/skills/`. These skills enable autonomous agents to handle complex engineering tasks with senior-level rigor:

- **Architecture**: `spec-driven-development`, `api-and-interface-design`, `documentation-and-adrs`
- **Execution**: `incremental-implementation`, `test-driven-development`, `context-engineering`
- **Validation**: `code-review-and-quality`, `browser-testing-with-devtools`, `security-and-hardening`
- **Delivery**: `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch`

## 🚀 Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed.

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

### Quality Control

The project uses a "Harness" to maintain high standards. Run this before any major change:

```bash
bun run harness
```

This triggers:

1. `eslint` — Style and static analysis
2. `tsc` — Strict type safety check
3. `check-git` — Conventional commit verification

## 📁 Structure

- `app/`: Next.js App Router (React 19 components)
- `content/`: Markdown sources for the blog
- `.agents/skills/`: Executable instructions for AI agents
- `docs/arch/`: Project invariants and architectural rules
- `scripts/`: Custom automation for the development lifecycle

## 🗳️ Developer

<a href="https://www.linkedin.com/in/joshydavid/"><img src="https://github.com/user-attachments/assets/f9dd5867-724a-4dff-a2ad-61c81ea6e3b5" width="80" title="Joshua David"></a>&nbsp;
