# Phase 4: Verify and Handoff

In this phase, verify the implemented flow. Provide go-live instructions that
match the available evidence.

## Verify

1. Run the formatter, build, type check, and project tests.
2. Create a checkout or invoice in sandbox.
3. Ask the user to complete a manual payment action when required.
4. Fetch the transaction again. Use only a verified transaction ID.
5. Make sure that the official status is `paid` before fulfillment.
6. Test duplicate delivery and fulfillment failure when the flow uses a webhook.
7. Make sure that the system grants the entitlement one time. Make sure that a
   retry can recover a `failed` state or an expired lease.

Ask for permission before you start a development server. If sandbox cannot
reach `paid`, report the verification limit. Do not report a successful
end-to-end test.

## Handoff

Report:

- Files that you created, changed, and deleted.
- Environment variables that the user must set.
- Successful checks and sandbox evidence.
- Remaining blockers or limits.
- This go-live checklist:
  - Set the production key and environment.
  - Set the production webhook URL when the flow uses a webhook.
  - Complete one low-value production transaction.
  - Monitor delivery and fulfillment.

## Completion criterion

The task is complete only when you report the regression checks. Clearly
identify verified and unverified payment or fulfillment results. Give the user
go-live instructions that they can complete.
