# Mayar Skills
<img width="1504" height="672" alt="mayar-3" src="https://github.com/user-attachments/assets/233ff1ed-9310-4f58-a154-60421754d3b8" />

Agent skills for [Mayar](https://mayar.id) payment and billing integrations in
Indonesia. The skills support QRIS, virtual accounts, e-wallets, and cards in
Claude Code, Codex, Cursor, Hermes Agent, OpenClaw, OpenCode, and any other
client that the [`skills` CLI](https://skills.sh) supports.

> Status: **Official Mayar skill, version 2.1.0.**

## Quick start

The fastest installation method uses the
[`skills` CLI](https://skills.sh):

```bash
npx skills add mayarid/skills --skill mayar-v2 --global --yes
```

To let an agent install the skill for you, open the prompt for your client,
copy the complete file, and paste it into that agent. Each prompt installs the
skill, checks the files, asks you to confirm that the client sees it, and then
asks what you want to do. It does not start an integration.

| Client | Prompt |
|---|---|
| Claude Code | [`install-claude-code.md`](prompts/install-claude-code.md) |
| Codex | [`install-codex.md`](prompts/install-codex.md) |
| Cursor | [`install-cursor.md`](prompts/install-cursor.md) |
| Hermes Agent | [`install-hermes-agent.md`](prompts/install-hermes-agent.md) |
| OpenClaw | [`install-openclaw.md`](prompts/install-openclaw.md) |
| Any other client | [`install-mayar-v2.md`](prompts/install-mayar-v2.md) |

Cowork, the Claude desktop app, and cloud sessions do not read
`~/.claude/skills/` on your machine. They load the skills enabled for your
claude.ai account. Enable the skill from **Customize** in the desktop app
sidebar, or from the skills settings on claude.ai. Cloud sessions also load a
skill committed to the repository's `.claude/skills/`.

## Contents

```
.
├── prompts/
│   ├── install-mayar-v2.md         install, any client
│   ├── install-claude-code.md      install, Claude Code
│   ├── install-codex.md            install, Codex
│   ├── install-cursor.md           install, Cursor
│   ├── install-hermes-agent.md     install, Hermes Agent
│   ├── install-openclaw.md         install, OpenClaw
│   ├── billing-one-time.md         one-time payment
│   ├── billing-invoice.md          itemized invoice
│   ├── billing-subscription.md     recurring membership
│   ├── billing-credit.md           prepaid credit wallet
│   ├── billing-license.md          software license
│   ├── billing-qris.md             dynamic QRIS
│   └── billing-installment.md      monthly installment
└── skills/
    └── mayar-v2/
        ├── SKILL.md                    router BUILD/OPS/LEARN
        ├── playbook/
        │   ├── discover.md             RECON + INTERVIEW
        │   ├── plan.md                 schema + approval gate
        │   ├── implement.md            auth + implementation
        │   └── verify.md               verification + handoff
        ├── references/
        │   ├── api-sources.md          docs source map
        │   ├── cli-commands.md         OPS command catalog
        │   ├── product-knowledge.md    LEARN answer rules
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

Copy the `skills/mayar-v2` directory of this repository to one path below. To
pin a version instead of `main`, copy it from the
[latest stable release](https://github.com/mayarid/skills/releases/latest).

Add `/mayar-v2` to the end of each path. The user path applies to every project.
The project path applies to one repository.

| Client | Project path | User path |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.cursor/skills/` or `.agents/skills/` | `~/.cursor/skills/` |
| Hermes Agent | `.hermes/skills/` | `~/.hermes/skills/` |
| OpenClaw | `<workspace>/skills/` | `~/.openclaw/skills/` |
| OpenCode | `.opencode/skills/` or `.agents/skills/` | `~/.config/opencode/skills/` |
| Gemini CLI | `.agents/skills/` | `~/.gemini/skills/` |
| GitHub Copilot | `.agents/skills/` | `~/.copilot/skills/` |

Cursor and OpenCode read `.agents/skills/` in addition to their own directory.
The Codex user path comes from the Codex documentation; the `skills` CLI writes
Codex skills to `~/.codex/skills/` instead.

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

The sales model determines the endpoint. Each model also has a full
copy-and-paste prompt. Paste it without editing it. These prompts need no
installation: the agent reads `skills/mayar-v2` straight from this repository,
then reads the live Mayar V2 documentation. The agent asks for everything else
that it needs.

| Example prompt | Model | Main endpoint | Full prompt |
|---|---|---|---|
| `Add payments so that I can sell an ebook.` | One-time payment | Payment link | [`billing-one-time.md`](prompts/billing-one-time.md) |
| `Create a digital-product checkout. Give the user a download link after payment.` | One-time payment and fulfillment | Payment link and webhook provisioning | [`billing-one-time.md`](prompts/billing-one-time.md) |
| `Add Mayar invoices for project-based client billing.` | Itemized invoice | Invoice create and `extraData` | [`billing-invoice.md`](prompts/billing-invoice.md) |
| `Create a monthly subscription for premium content.` | Membership or subscription | Membership register and invoice per term | [`billing-subscription.md`](prompts/billing-subscription.md) |
| `Let users buy credit. Deduct credit for each AI request.` | Credit usage | Credit add, spend, and balance | [`billing-credit.md`](prompts/billing-credit.md) |
| `Sell software licenses that users activate with a code.` | SaaS or software license | SaaS activate and verify | [`billing-license.md`](prompts/billing-license.md) |
| `Create an on-demand QRIS payment for a cash register.` | Dynamic QRIS | QR code create | [`billing-qris.md`](prompts/billing-qris.md) |
| `Let buyers pay for a course across 12 months.` | Installment | Installment create | [`billing-installment.md`](prompts/billing-installment.md) |

Two prompts carry a limit. Read it at the top of the file before you paste it:

- **Dynamic QRIS**: the public V2 documentation defines no identifier for a
  dynamic QR code and no webhook payload, so the application cannot confirm
  that one QRIS payment succeeded. Plan for dashboard reconciliation.
- **Installment**: this model is newer than the skill. The interview in
  `playbook/discover.md` does not list it, so the agent reads the installment
  documentation from the start and asks more questions.

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

| Example prompt | Agent action | Command |
|---|---|---|
| `Show my Mayar balance.` | Read the account balance. | `npx -y mayar@latest balance` |
| `Show the last 10 invoices.` | List invoices and apply the limit. | `npx -y mayar@latest invoice list --limit 10` |
| `Show today's transactions.` | Read today's transactions. | `npx -y mayar@latest tx daily` |
| `Show unpaid transactions.` | Read transactions that are not paid. | `npx -y mayar@latest tx unpaid` |
| `Create a membership product with three tiers.` | Ask for the environment, then create the product. | `npx -y mayar@latest product create --type membership` |
| `Register the webhook https://app.com/hooks/mayar.` | Ask for the environment, then register the URL. | `npx -y mayar@latest webhook register <url>` |
| `Find and retry the last failed webhook.` | Read the history, identify the failed delivery, then retry that ID. | `npx -y mayar@latest webhook history` and `npx -y mayar@latest webhook retry <id>` |
| `Find the customer with email budi@gmail.com.` | Search customers by email. | `npx -y mayar@latest customer search budi@gmail.com` |
| `Send that customer a portal magic link.` | Ask for the environment, then send the link to that email. | `npx -y mayar@latest customer magic-link <email>` |
| `Create a QRIS payment for IDR 50,000.` | Ask for the environment, then create the QR code. | `npx -y mayar@latest qrcode 50000` |
| `Verify license ABC123 for product X.` | Verify the license against the product ID. | `npx -y mayar@latest saas verify ABC123 <productId>` |
| `Use sandbox.` | Override the base URL for the whole session. | `MAYAR_API_URL=https://api.mayar.io/hl/v2 npx -y mayar@latest --sandbox <command>` |

### LEARN: questions about Mayar

The agent reads the Mayar documentation and answers. It changes no file and
runs no command:

| Example prompt | Agent action |
|---|---|
| `What is Mayar?` | Read the documentation and answer with the pages used. |
| `Which payment methods can Mayar accept?` | Read `onlinepaymentmethod`. |
| `How do I verify my business?` | Read `businessverify`. |
| `Can Mayar sell an online course?` | Read the product page for that type. |
| `What does merchant of record mean here?` | Read the `mor/` pages. |
| `How is Mayar different from another payment gateway?` | Describe Mayar from the documentation only. |

Two limits apply. The agent answers only what a documentation page states; it
reports a missing fee or limit instead of estimating it. The documentation
describes Mayar alone, so the agent does not describe, rank, or price another
provider. Ask Mayar support about commercial terms, pricing, or account status.

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
