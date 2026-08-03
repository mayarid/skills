---
name: mayar-v2
description: >
  Use this skill when the user wants to integrate Mayar payments or billing
  into an application—checkout, payment links, invoices, memberships,
  subscriptions, credit wallets, licenses, QRIS, or webhooks—or operate their
  Mayar account from the terminal, including balance, products, customers,
  transactions, invoices, and webhook administration.
compatibility: Requires network access to Mayar documentation and API. OPS commands require Node.js 18+ and npx.
metadata:
  version: "2.0.0"
---

# Mayar

Select one branch from the user request:

- **BUILD** — Add a Mayar integration to an application. This branch includes
  the UI, server, persistent data, and fulfillment.
- **OPS** — Manage or test a Mayar account from the terminal.

Use the Mayar V2 documentation for API facts. Use
`npx -y mayar@latest <command> --help` for CLI syntax.

## OPS

Read [references/cli-commands.md](references/cli-commands.md). Follow only the
OPS procedure in that file. Do not load the BUILD playbook.

## BUILD: strict phase gates

Complete one phase at a time. Do not read the next phase file until you meet the
completion criteria for the current phase.

### Phase 1 — Discover

Read [playbook/discover.md](playbook/discover.md). Stay in this phase until
RECON is complete and all user decisions are recorded.

### Phase 2 — Plan

After Discover is complete, read [playbook/plan.md](playbook/plan.md). Stay in
this phase until you read the official schema. The user must also approve the
plan and the exact fulfillment operation.

### Phase 3 — Implement

After explicit approval, read [playbook/implement.md](playbook/implement.md).
Stay in this phase until all planned changes are complete and all project checks
pass.

### Phase 4 — Verify

After Implement is complete, read [playbook/verify.md](playbook/verify.md).
Complete the sandbox evidence, regression checks, and handoff before you close
the task.
