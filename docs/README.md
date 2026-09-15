# Docs

Task-scoped guides for AI agents. Read the one that matches your task — don't read all of them.

| Doc | Read it before you… |
|-----|---------------------|
| [architecture.md](architecture.md) | touch routing, i18n, data flow, rendering, or need the file map |
| [code-style.md](code-style.md) | write or edit any TS / React / API / Prisma code |
| [design-style.md](design-style.md) | build or change UI — styling, layout, typography, motion |
| [development.md](development.md) | run the app locally, or verify a change |
| [deployment.md](deployment.md) | deploy to production |

Root [`/AGENTS.md`](../AGENTS.md) is the entry point and lists the non-negotiable invariants.

## Rules for editing these docs
- Facts only. No prose that a snippet or a `file.ts:line` reference can carry.
- The code is the source of truth. Point to a canonical file instead of pasting large blocks; keep snippets ≤ ~10 lines.
- When a convention changes in code, update the doc in the same commit.
