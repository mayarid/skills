# Mayar Skills
<img width="1504" height="672" alt="mayar-3" src="https://github.com/user-attachments/assets/233ff1ed-9310-4f58-a154-60421754d3b8" />

Agent skills for [Mayar](https://mayar.id) payment and billing integrations in
Indonesia. The skills support QRIS, virtual accounts, e-wallets, and cards in
Claude Code, Cursor, Codex, and OpenCode.

> Status: **Official Mayar skill, version 2.0.0.**

## Quick start

The fastest installation method uses the
[`skills` CLI](https://skills.sh):

```bash
npx skills add mayarid/skills
```

To install and start an integration in one agent session, open
[`prompts/install-and-integrate-mayar-v2.md`](prompts/install-and-integrate-mayar-v2.md),
copy the complete prompt, and paste it into your coding agent. The prompt
detects the client, installs the latest stable release, validates the skill,
and starts the BUILD workflow.

## Contents

```
.
├── prompts/
│   └── install-and-integrate-mayar-v2.md
└── skills/
    └── mayar-v2/
        ├── SKILL.md                    router BUILD/OPS
        ├── playbook/
        │   ├── discover.md             RECON + INTERVIEW
        │   ├── plan.md                 schema + approval gate
        │   ├── implement.md            auth + implementation
        │   └── verify.md               verification + handoff
        ├── references/
        │   ├── api-sources.md          docs source map
        │   ├── cli-commands.md         OPS command catalog
        │   ├── webhook-safety.md       fail-closed + idempotency
        │   ├── stack-pattern.md        generic server contract
        │   ├── stack-nextjs.md
        │   ├── stack-tanstack-start.md
        │   └── stack-vite-react.md
        └── scripts/
            └── validate.mjs            structural drift validator
```

## About version 2

Version 2 provides account operations and an application-integration playbook
for coding agents:

- **Progressive disclosure**: `SKILL.md` is only a router. The agent loads
  details for the active phase.
- **Strict gates**: The agent completes Discover, Plan, Implement, and Verify in
  sequence.
- **Live schema**: The agent reads endpoints from the Mayar V2 documentation.
  It does not use a local schema snapshot.
- **Conditional security**: The agent loads webhook safety instructions only
  for a webhook flow.
- **Portable OPS**: The CLI catalog is separate from API facts.

Each phase has one completion criterion. The structure follows the
[Agent Skills Specification](https://agentskills.io/specification),
progressive disclosure, and a single source of truth.

## Manual installation

Use the [latest stable release](https://github.com/mayarid/skills/releases/latest),
not an unpinned `main` branch. Copy its `skills/mayar-v2` directory to one
project-local path:

| Client | Project-local path |
|---|---|
| Cursor | `.cursor/skills/mayar-v2` |
| Claude Code | `.claude/skills/mayar-v2` |
| Codex | `.agents/skills/mayar-v2` |
| OpenCode | `.opencode/skills/mayar-v2` |
| Gemini CLI | `.gemini/skills/mayar-v2` |
| VS Code or GitHub Copilot | `.github/skills/mayar-v2` |

Create the parent directory first. If the target already exists, validate it or
move it to a backup before replacement. Run the bundled validator after the
copy operation. Use the client refresh command when available; otherwise,
restart the client.

## Usage

### BUILD: application integration

For this prompt, the agent runs Discover, Plan, Implement, and Verify:

```
Add Mayar payments to this website.
```

The sales model determines the endpoint:

| Example prompt | Model | Main endpoint |
|---|---|---|
| `Add payments so that I can sell an ebook.` | One-time payment | Payment link |
| `Create a digital-product checkout. Give the user a download link after payment.` | One-time payment and fulfillment | Payment link and webhook provisioning |
| `Add Mayar invoices for project-based client billing.` | Itemized invoice | Invoice create and `extraData` |
| `Create a monthly subscription for premium content.` | Membership or subscription | Membership register and invoice per term |
| `Let users buy credit. Deduct credit for each AI request.` | Credit usage | Credit add, spend, and balance |
| `Sell software licenses that users activate with a code.` | SaaS or software license | SaaS activate and verify |
| `Create an on-demand QRIS payment for a cash register.` | Dynamic QRIS | QR code create |

The project situation determines the reference:

| Example prompt | Agent action |
|---|---|
| `Add Mayar payments. Use the recommended options.` | Use the recommended interview choices. |
| `My website uses TanStack Start. Add Mayar payments.` | Load `references/stack-tanstack-start.md` during Implement. |
| `My project is a React Vite SPA. Can it accept payments?` | Explain the server-runtime requirement from `stack-vite-react.md`. |
| `My payment webhook runs fulfillment twice. Check it.` | Load `references/webhook-safety.md`. |
| `Prepare this sandbox integration for production.` | Run Verify and provide the production checklist. |

### OPS: account operations

The agent runs the CLI directly:

| Example prompt | Command |
|---|---|
| `Show my Mayar balance.` | `npx -y mayar@latest balance` |
| `Show the last 10 invoices.` | `npx -y mayar@latest invoice list --limit 10` |
| `Show today's transactions.` | `npx -y mayar@latest tx daily` |
| `Show unpaid transactions.` | `npx -y mayar@latest tx unpaid` |
| `Create a membership product with three tiers.` | `npx -y mayar@latest product create --type membership` |
| `Register the webhook https://app.com/hooks/mayar.` | `npx -y mayar@latest webhook register <url>` |
| `Find and retry the last failed webhook.` | `npx -y mayar@latest webhook history` and `npx -y mayar@latest webhook retry <id>` |
| `Find the customer with email budi@gmail.com.` | `npx -y mayar@latest customer search budi@gmail.com` |
| `Send that customer a portal magic link.` | `npx -y mayar@latest customer magic-link <email>` |
| `Create a QRIS payment for IDR 50,000.` | `npx -y mayar@latest qrcode 50000` |
| `Verify license ABC123 for product X.` | `npx -y mayar@latest saas verify ABC123 <productId>` |
| `Use sandbox.` | `MAYAR_API_URL=https://api.mayar.io/hl/v2 npx -y mayar@latest --sandbox <command>` |

## Prerequisites

- Network access to the Mayar documentation and API.
- Node.js 18 or later for the OPS branch and bundled validator.
- A Mayar API key from [web.mayar.id](https://web.mayar.id/api-keys) for
  production or [web.mayar.io](https://web.mayar.io/api-keys) for sandbox.

## Known limitations and safety constraints

- The public webhook documentation does not define a transaction ID field. The
  skill uses a fail-closed flow until documentation or an actual sample payload
  verifies the mapping.
- Mayar does not provide an official SDK. Stack references use native `fetch`
  with a small helper.
- `metadata.version` is the skill version. It is not the Mayar product version.

## Validate the skill

From the repository root:

```bash
node skills/mayar-v2/scripts/validate.mjs
```

The bundled validator checks frontmatter, structure, links, Markdown fences,
router size, and stale facts.

Maintainers can also use the optional official
[`skills-ref`](https://github.com/agentskills/agentskills/tree/main/skills-ref)
validator after installing its Python 3.11+ development environment:

```bash
skills-ref validate ./skills/mayar-v2
```

## License

MIT
