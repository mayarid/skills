# Phase 1: Discover

In this phase, examine the application and record the monetization decisions.
Complete this phase before you design the integration.

## RECON

Examine the project before you ask questions:

- Identify the framework, language, and package manager.
- Identify the server runtime and the route or API locations.
- List the `.env*` filenames. Do not read secret values.
- Identify the database, ORM, and existing entitlement model.
- Identify pricing, product, dashboard, and landing pages.
- Identify an existing payment integration.

Select the stack reference that you will use in Phase 3:

- Next.js → `references/stack-nextjs.md`
- TanStack Start → `references/stack-tanstack-start.md`
- React Vite or Cloudflare Workers → `references/stack-vite-react.md`
- Other stacks → `references/stack-pattern.md`

## INTERVIEW

Ask about one decision in each message. Wait for the answer before you ask the
next question. Provide options and identify one recommended option. Use the
RECON results. Do not ask for information that is already available.

Ask about these decisions in this order. Skip a decision that is already
explicit:

1. Sales model: one-time payment, invoice, membership, credit, or license.
2. Checkout type: hosted Mayar page or an invoice flow in the official schema.
3. CTA or checkout location in the application.
4. Pricing page requirement.
5. User interface after payment.
6. Exact fulfillment operation, including database fields, tiers, and special
   conditions.
7. State that indicates active access.
8. Availability of an actual sample payload when the flow uses a webhook.

The user must define fulfillment. Do not infer entitlements or database
changes.

## Completion criterion

This phase is complete only when:

- The stack, server runtime, environment file, persistent storage, and
  monetization surfaces are known or marked as unavailable.
- Each decision in this file is recorded.
- The user confirms the exact fulfillment operation.
- The webhook requirement and available evidence are known.

When all conditions are true, return to `SKILL.md` and open Phase 2.
