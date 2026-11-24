<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent skills

Use `$project-workflow` to find the current issue, specification, and related project documentation. Read these adapters when invoking Matt Pocock skills directly as well.

- [Issue tracker](docs/agents/issue-tracker.md)
- [Domain documentation](docs/agents/domain.md)
- [Triage roles](docs/agents/triage-labels.md)

### Private workflow configuration

Run `git rev-parse --path-format=absolute --git-common-dir` from the checkout. Keep verified service links and IDs in `info/portfolio-workflow.md` beneath that Git directory so the same mappings are available from linked worktrees. Use sections for Linear, ChatGPT Spaces, and triage roles as described in the adapters. Store credentials in the corresponding apps or credential store.

On a fresh clone, use any explicit, verified destination in the request. If the needed destination is still missing, ask for the destination or use `$setup-project` when setup is requested.
