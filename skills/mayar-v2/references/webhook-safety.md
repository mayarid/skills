# Webhook Safety

Read this file before you implement a webhook or asynchronous fulfillment.

## Fail-closed evidence gate

A webhook is a notification. It is not proof of payment. The public
documentation describes `data.id` as a webhook ID. It does not define a
transaction ID field.

A transaction ID mapping is verified only when:

- A V2 documentation page defines it.
- An actual sample payload matches `GET /transactions/{id}` in the same
  environment.

Without a verified mapping, accept and store the event securely for audit.
Stop the flow before provisioning. Remove secrets and unnecessary PII.

## Verified flow

```text
validate event
extract verified transaction ID
GET /transactions/{transactionId}
status is not paid → stop
claim transaction ID atomically
run idempotent fulfillment
mark completed after success
failure → mark failed and retain retry evidence
```

Only the official `paid` status from the transaction detail permits
fulfillment. A browser redirect or webhook payload status is not sufficient.

## Persistence contract

Use a table with these minimum fields:

```text
transaction_id UNIQUE
status processing | completed | failed
attempt_count
last_error
locked_until
updated_at
completed_at
```

The claim operation must be atomic:

- `completed` → Acknowledge without a second fulfillment operation.
- `processing` with an active lease → Do not start a second worker.
- `processing` with an expired lease → Permit a new claim.
- `failed` → Permit a retry.
- Set `completed` only after fulfillment succeeds.

Fulfillment must also be idempotent against the domain state. The delivery table
alone is not sufficient.

## Verification cases

- A payload without a verified transaction ID does not grant access.
- A transaction status other than `paid` does not grant access.
- Two copies of the same event cause one fulfillment operation.
- The system recovers from a crash after the lease expires.
- The system records a fulfillment failure and permits a retry.
- Logs do not contain the API key or a raw sensitive payload.
