# Agent J

A minimalist, high-performance web application built with the latest Next.js and React primitives.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (Canary)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) & [Gray Matter](https://github.com/jonschlinkert/gray-matter)

## 🤖 The Agent

This project is maintained by a **Senior Product Engineer** agent persona. The agent follows a strict architectural philosophy:
- **Minimalist & Direct**: Focused on clean, performant code without corporate bloat.
- **Quality Gates**: Every change is validated against structural invariants, linting, and type safety.
- **Decentralized Documentation**: Detailed architectural guidelines are found in `docs/arch/`.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

### Production

```bash
bun run build
bun start
```

## 🤝 Contribution

We welcome contributions! To maintain the integrity of the project, please follow these guidelines:

### Quality Gates
Before submitting a Pull Request, ensure all quality gates pass:
```bash
bun run harness
```
This script executes:
1. `eslint` (Style compliance)
2. `tsc` (Type checking)
3. `check-git` (Conventional commit verification)
