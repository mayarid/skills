# Phase 2: Plan

In this phase, create a plan from the official schema. Get approval before you
change project files.

## Resolve schema

Read the [API source map](../references/api-sources.md). Complete these steps
for each required operation:

1. Find the V2 endpoint page through `llms.txt`.
2. Read the endpoint `.md` page.
3. Record the method, path, request fields, response fields, and documented
   errors.
4. Do not use model memory, old snapshots, or V1 documentation.

If the documentation does not define a required field, record a blocker or use
a fail-closed flow. Do not estimate the field.

## Create the plan

The plan must include:

- The sales model and the approved fulfillment operation.
- The documentation pages and endpoints.
- Files to create, change, or delete.
- Server-only variables: `MAYAR_API_KEY`, `MAYAR_ENV`, and `APP_URL`.
- Checkout, CTA or pricing, redirect, persistent data, and fulfillment.
- Idempotency and failure recovery.
- Webhook limits when the transaction ID is not verified.
- The implementation and sandbox verification sequence.

Describe the fulfillment operation precisely. Identify the record, changed
fields, and access conditions. Ask the user to revise the plan or give explicit
approval.

## Approval gate

Stop after you provide the plan. Do not change source files, configuration,
databases, webhooks, or the Mayar account before the user approves the plan.

## Completion criterion

This phase is complete only when:

- Each endpoint and field has a V2 documentation source.
- The plan includes each file and state change.
- Fulfillment and webhook limits are explicit.
- The user approves the plan.

When all conditions are true, return to `SKILL.md` and open Phase 3.
