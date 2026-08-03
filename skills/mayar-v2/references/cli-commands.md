# Mayar CLI Commands

Use this file only for the OPS branch.

Use `npx -y mayar@latest <command> --help` as the syntax source. If this catalog
differs from the current help output, use the help output. Continue to use
`references/api-sources.md` for endpoint facts.

## Environment and auth

Select the environment before a write operation. Ask the user when the request
does not specify sandbox or production.

Use `--production` for production. For sandbox, override the base URL from the
documentation:

```bash
MAYAR_API_URL=https://api.mayar.io/hl/v2 npx -y mayar@latest --sandbox <command>
```

Verify authentication:

```bash
npx -y mayar@latest whoami --json
npx -y mayar@latest status
npx -y mayar@latest api-key <key>
npx -y mayar@latest login [--no-browser]
npx -y mayar@latest config show
npx -y mayar@latest balance
```

Use `--json` for machine-readable output.

## Invoices

```bash
npx -y mayar@latest invoice list [--limit N --after CURSOR]
npx -y mayar@latest invoice get <id>
npx -y mayar@latest invoice create --data '<json|@file>'
npx -y mayar@latest invoice edit <id> --data '<json|@file>'
npx -y mayar@latest invoice status <id> <open|close|active|closed|unlisted>
npx -y mayar@latest invoice close <id>
npx -y mayar@latest invoice reopen <id>
npx -y mayar@latest invoice filter --email <email>
```

## Products and payments

```bash
npx -y mayar@latest product list [--limit N --search Q --type T]
npx -y mayar@latest product search <keyword>
npx -y mayar@latest product get <id>
npx -y mayar@latest product create --type <type> --data '<json|@file>'
npx -y mayar@latest product edit <id> --data '<json|@file>'
npx -y mayar@latest product status <id> <open|close|active|closed|unlisted>
npx -y mayar@latest product transactions <id>
npx -y mayar@latest payment-link edit <id> --data '<json|@file>'
npx -y mayar@latest payment list [--status paid|unpaid|closed]
npx -y mayar@latest payment get <id>
npx -y mayar@latest payment create --data '<json|@file>'
npx -y mayar@latest payment edit <id> --data '<json|@file>'
npx -y mayar@latest payment status <id> <open|close|active|closed|unlisted>
```

## Customers and transactions

```bash
npx -y mayar@latest customer list
npx -y mayar@latest customer create --data '<json|@file>'
npx -y mayar@latest customer search <email>
npx -y mayar@latest customer update <fromEmail> <toEmail>
npx -y mayar@latest customer magic-link <email>
npx -y mayar@latest tx list [--status S --customerId ID --startAt T --endAt T]
npx -y mayar@latest tx unpaid
npx -y mayar@latest tx daily
npx -y mayar@latest tx product <productId>
```

## Membership, credit, and licenses

```bash
npx -y mayar@latest membership members --productId <id>
npx -y mayar@latest membership tiers --productId <id>
npx -y mayar@latest membership register --data '<json|@file>'
npx -y mayar@latest credit balance --customerId <id> --productId <id> [--tierId <id>]
npx -y mayar@latest credit add --data '<json|@file>'
npx -y mayar@latest credit spend --data '<json|@file>'
npx -y mayar@latest credit history <customerId> --productId <id> [--page N --limit N]
npx -y mayar@latest credit register-usage --data '<json|@file>'
npx -y mayar@latest credit register-membership --data '<json|@file>'
npx -y mayar@latest credit checkout --data '<json|@file>'
npx -y mayar@latest saas activate <licenseCode> <productId>
npx -y mayar@latest saas deactivate <licenseCode> <productId>
npx -y mayar@latest saas verify <licenseCode> <productId>
npx -y mayar@latest software verify <licenseCode> <productId>
```

## QRIS, reviews, and webhooks

```bash
npx -y mayar@latest qrcode <amount_idr>
npx -y mayar@latest qrcode static
npx -y mayar@latest qrcode channels
npx -y mayar@latest review list [--status S --paymentLinkId ID --rating N]
npx -y mayar@latest review stats [productId]
npx -y mayar@latest review create --data '<json|@file>'
npx -y mayar@latest review update <id> --data '<json|@file>'
npx -y mayar@latest review bulk-status --data '<json|@file>'
npx -y mayar@latest webhook register <url>
npx -y mayar@latest webhook test <url>
npx -y mayar@latest webhook history
npx -y mayar@latest webhook new-history
npx -y mayar@latest webhook retry <historyId>
```

## Global flags

- `--json` — raw JSON
- `--limit N` and `--after CURSOR` — pagination
- `--api-key <key>` — per-run key override
- `--sandbox`, `--production`, or `--env <value>` — environment
- `--data <json|@file>` — request body

A non-zero exit code indicates failure. If `whoami` returns `"valid": false`,
ask the user to set the key for the selected environment.
