# Native Checkout

Checkout type is `native`. Do not ask the user to pick hosted, embedded, or
native. The mayar-v2 skill now offers those three types. This prompt locks
native.

Build a Mayar checkout that renders the payment instrument inside the
application. This document covers production only.

It is self-contained. You do not need the `mayar-v2` skill installed. Give this
document to your coding agent, or paste its URL into the chat. Every link goes
deeper. No link is required to finish the work.

## Read the schema first

Field lists change. Read the live page before you write the request body:

1. Fetch <https://docs.mayar.id/llms.txt>.
2. Open the page under `/api-reference-v2/` that you need.
3. Take the method, path, request, response, and errors from that page.

The pages this flow uses:

- [Create invoice](https://docs.mayar.id/api-reference-v2/invoice/create.md) —
  the `paymentMethod` values live here. Do not use a remembered list.
- [Transaction detail](https://docs.mayar.id/api-reference-v2/transaction/detail.md)
  — your only evidence of payment.
- [Rate limit](https://docs.mayar.id/api-reference-v2/rate-limit.md)
- [V2 introduction](https://docs.mayar.id/api-reference-v2/introduction.md)

Do not use V1 documentation. Do not use an old example as a schema.

## What native checkout means

A hosted checkout sends the buyer to a Mayar page. A native checkout keeps the
buyer in the application.

The flow has five steps:

1. The buyer selects one payment channel in your user interface.
2. Your server creates an invoice and sets `paymentMethod` to that channel.
3. Mayar returns `paymentDetail` on the create response.
4. Your page renders the QR code, the virtual account number, or the e-wallet
   link.
5. Your server grants access only after it reads a `paid` transaction.

A pinned `paymentMethod` is what makes Mayar issue the instrument. An invoice
without it returns the hosted link only.

`paymentDetail` is on the create response only. `GET /invoices/{id}` does not
return it. Store what you need at create time.

Do not use `POST /qr-codes/create` for this flow. That endpoint returns a URL
and an amount only. It carries no transaction ID and no `extraData`, so you
cannot connect a payment to an order.

## Production prerequisites

- Base URL: `https://api.mayar.id/hl/v2`. Get the API key from
  [web.mayar.id](https://web.mayar.id) → Integration → API Key.
- Keep the key in a secret store. The key must never reach the client bundle or
  a response body.
- Each offered channel must be active on the Mayar account. An inactive channel
  fails at create time, not in your channel list.
- Some channels need separate activation. Ask the account owner before you
  offer them.
- Real money moves on the first test. Use the smallest amount you sell.

## Transport

Send the API key as a Bearer token. The V2 envelope is
`{ statusCode, messages, data }`. Some write endpoints use the singular field
`message`.

The envelope carries its own status, and that status is not always the HTTP
status. Check both. A `200` response with `statusCode: 429` is still a refusal.

```ts
const BASE_URL = "https://api.mayar.id/hl/v2";

export class MayarError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "MayarError";
  }
}

export async function mayarFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = (await response.json()) as {
    statusCode?: number;
    messages?: string;
    message?: string;
    data?: T;
  };
  const statusCode = body.statusCode ?? response.status;

  if (!response.ok || statusCode >= 400) {
    throw new MayarError(
      body.messages ?? body.message ?? `HTTP ${response.status}`,
      statusCode,
    );
  }

  return body.data as T;
}
```

Read the key from the server environment only. On a Worker, build the
configuration from the `env` bindings. Do not change `process.env`.

A client-only application needs one server function or one small Worker. The
key cannot live in the browser.

## Channel list

Keep the offered channels in one server-owned list. The list must match the
Mayar account.

Remove a channel when its behavior does not fit your invoice life:

- An over-the-counter channel needs days. An invoice that lives one hour cannot
  use it.
- A channel that needs an extra field at create time is unusable when you never
  collect that field.

Send the channel code from the client. Validate it against the server list. A
client value must never reach the create call unchecked. Validate the price the
same way. Take the price from server-owned data, never from the request.

## Order record

Write your order row before you call Mayar. A failed create then leaves
evidence instead of a silent gap. Hide a pending row that has no payment URL.
That row is a create that failed.

Put your own order ID in `extraData` on create. Read that ID back from the
transaction detail later. Never read it from a webhook payload.

Save these fields from the create response:

| Field | Use |
|---|---|
| `id` | The invoice ID. |
| `transactionId` | The ID you re-read for evidence of payment. |
| `link` | The hosted page. This is your fallback. |
| `paymentDetail` | The instrument, normalized. See the next section. |
| `expiredAt` | The invoice expiry. The channel expiry can be earlier. |

## `paymentDetail` is undocumented

No V2 page defines `paymentDetail`. Treat it as untrusted input.

The field paths below come from captured payloads, not from documentation.
Verify them again against your own account before you depend on them.

| `type` | Read these fields |
|---|---|
| `QR_CODE` | `qr_code.channel_properties.qr_string` |
| `VIRTUAL_ACCOUNT` | `virtual_account.channel_code`, `virtual_account.channel_properties.virtual_account_number`, `virtual_account.channel_properties.customer_name` |
| `EWALLET` | `ewallet.channel_code`, and `actions[]` entries with `url` and `url_type` |

`url_type` values seen in production are `WEB`, `MOBILE`, and `DEEPLINK`. Some
wallets return a QR code in the action instead of a link.

Apply these rules:

- The parser must never throw. Return `null` for any shape it does not
  recognize.
- On `null`, show the hosted `link`. The documentation defines that field.
- Store your normalized object. Never store the provider object.
- Parse the stored object again on each read. Do not trust it because you wrote
  it.
- Validate the URL scheme of every e-wallet action before the URL reaches a
  link. Permit `https:` and the known wallet schemes only. Reject all others.
  This stops stored cross-site scripting.

```ts
const ALLOWED_SCHEMES = new Set(["https:", "dana:", "gojek:", "shopeeid:"]);

function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    return ALLOWED_SCHEMES.has(new URL(value).protocol) ? value : null;
  } catch {
    return null;
  }
}

export function parsePaymentDetail(value: unknown): PaymentDetail | null {
  const detail = asRecord(value);
  if (!detail) return null;

  switch (asText(detail.type)?.toUpperCase()) {
    case "QR_CODE":
      return parseQris(detail);
    case "VIRTUAL_ACCOUNT":
      return parseVirtualAccount(detail);
    case "EWALLET":
      return parseEwallet(detail);
    default:
      return null;
  }
}
```

## Expiry

A channel gives its own expiry in `channel_properties.expires_at`. That expiry
wins. The QR code stops working at that time, whatever the invoice says.

Keep the invoice life short for a QR code or an e-wallet session. One hour is a
workable value. A visible countdown is better than a code that stops silently.

A virtual account is different. People pay one from a banking application
later. Keep the order open for a grace period after expiry, and keep reading it
back. Without that grace, a late payment becomes money taken with no delivery.

## Payment confirmation

The instrument is a rendering concern. It is never evidence of payment.

A webhook is a notification, not proof. A browser redirect is not proof either.
`redirectUrl` returns the buyer to your page after payment. It is user
interface feedback only. It grants nothing.

Three paths must call one settlement function:

1. The webhook, which is the normal path.
2. The browser poll, while the buyer watches the screen.
3. A scheduled job, for the webhook that never arrived.

Each path runs the same gate:

```text
validate the event
extract a verified transaction ID
GET /transactions/{transactionId}
status is not paid → stop
claim the transaction ID atomically
run idempotent fulfillment
mark completed after success
failure → mark failed and keep the evidence for a retry
```

Only the `paid` status from the transaction detail permits fulfillment.

### Verify the transaction ID

The public documentation describes `data.id` as a webhook ID. It does not
define a transaction ID field. A mapping is verified only when a documentation
page defines it, or when a real payload matches `GET /transactions/{id}` in the
same environment.

Without a verified mapping, store the event for audit and stop before
fulfillment. Do not guess.

A safe method: treat the payload as a hint only. Select candidate orders from
your own pending rows, by customer and amount. Read each candidate back from
Mayar. Accept the first one where the amount matches, the status is `paid`, and
`extraData` carries your order ID. Cap the candidate list, because each
candidate costs one request.

### Protect the ingress

Mayar sends no webhook signature. Protect the route another way:

- Put a long secret in the webhook path. Compare it with a constant-time
  comparison, and answer `404` on a mismatch.
- Reject a body larger than a small limit. Measure the encoded byte length, not
  the string length.
- Rate-limit the route.
- Keep secrets and unnecessary personal data out of the logs.

### Persistence contract

Use a delivery table with these minimum fields:

```text
transaction_id UNIQUE
status         processing | completed | failed
attempt_count
last_error
locked_until
updated_at
completed_at
```

The claim must be atomic:

- `completed` → acknowledge. Do not fulfill a second time.
- `processing` with an active lease → do not start a second worker.
- `processing` with an expired lease → permit a new claim.
- `failed` → permit a retry.
- Set `completed` only after fulfillment succeeds.

Fulfillment must also be idempotent against your own domain state. The delivery
table alone is not enough. A unique constraint on the fulfillment record is the
second gate.

## Request budget

The API key permits 50 requests each minute for everything the application
does. A native checkout polls, so the budget is what sizes the design.

Claim the right to read before every provider call. Use a compare-and-swap on a
`last_checked_at` column. Write the stamp before the call:

```sql
UPDATE orders
   SET last_checked_at = :now
 WHERE id = :id
   AND status = 'pending'
   AND (last_checked_at IS NULL OR last_checked_at < :now - :min_gap)
```

An empty result means another caller holds the read. That is a normal answer,
not an error.

The claim gives four results:

- Several browser tabs produce one provider request between them.
- A provider timeout backs the caller off. It does not invite a retry storm.
- The scheduled job and the browser never duplicate a read.
- No path can reach Mayar without passing the claim.

Suggested cadence:

| State | Browser poll | Provider read |
|---|---|---|
| First two minutes | 5 s | 15 s |
| After that | 15 s | 60 s |
| Settled | stop | stop |

Add two more savings:

- Pass the transaction you already read into the settlement function. Do not
  read the same record twice.
- Cap the scheduled job at ten orders each run. Skip any order read in the last
  minute.

Stop a run when the API answers `429` for the rate limit. Follow `Retry-After`.

## Duplicate create

Mayar refuses a second create for one customer at one amount for about one
minute. The answer is `429` with a duplicate message. A different description
does not defeat it.

Report that delay to the buyer. Do not change the payload at random to get past
it.

## Order reuse

Key the reuse on the product and the channel together. One invoice carries one
channel, so a buyer who changes from QRIS to a virtual account needs a new
invoice.

Leave a superseded pending order pending. Do not expire it early. The buyer may
still pay the virtual account it holds. Let it die at its own expiry.

## Failure modes

| Symptom | Cause | Action |
|---|---|---|
| Create fails for one channel only | The channel is not active on the account | Activate it, or remove it from the list |
| `429` on create | Duplicate customer and amount inside one minute | Wait one minute. Retry with the same payload |
| `429` on read | The 50-requests limit | Follow `Retry-After`. Widen the poll gap |
| `paymentDetail` is absent or unknown | Undocumented shape changed | Show the hosted `link`. Log the raw shape |
| Buyer paid, no delivery | The order closed before the late payment | Add the expiry grace period |
| Delivered twice | Fulfillment is not idempotent | Apply the persistence contract above |
| HTTP 200 with `statusCode` 4xx | The V2 envelope carries its own status | Check both statuses |

## Verification cases

Prove each case before you go live:

- A payload without a verified transaction ID grants nothing.
- A transaction status other than `paid` grants nothing.
- Two copies of one event cause one fulfillment.
- The system recovers after a crash, once the lease expires.
- A fulfillment failure is recorded, and a retry is permitted.
- The logs contain no API key and no raw sensitive payload.
- One small real payment completes end to end.

## Production checklist

- [ ] The API key is a production key, and it is in a secret store.
- [ ] The key never reaches the client bundle or a response body.
- [ ] Each offered channel is active on the account.
- [ ] The `paymentMethod` values come from the current documentation page.
- [ ] The order row is written before the create call.
- [ ] `extraData` carries your own order ID.
- [ ] The `paymentDetail` parser never throws, and it falls back to the hosted
      link.
- [ ] Every e-wallet URL passes a scheme allowlist.
- [ ] The webhook path holds a secret, and the ingress is rate-limited.
- [ ] Fulfillment reads `GET /transactions/{id}` and accepts `paid` only.
- [ ] Fulfillment is idempotent against the domain state.
- [ ] A scheduled job reconciles orders whose webhook never arrived.
- [ ] Every provider read passes the claim.
- [ ] The go-live payment is verified in the Mayar dashboard.

## Worked example

`imagenation` sells credit packs with this pattern in production on Cloudflare
Workers: <https://github.com/julianromli/imagenation-saas>

| Concern | File |
|---|---|
| API helper, envelope, `429` classes | [`src/lib/mayar.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/lib/mayar.ts) |
| Channel list and `paymentDetail` parser | [`src/lib/payment-methods.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/lib/payment-methods.ts) |
| Create, claim, poll, reconcile | [`src/lib/purchase.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/lib/purchase.ts) |
| Webhook verification and settlement | [`src/lib/payment.functions.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/lib/payment.functions.ts) |
| Webhook ingress with a path secret | [`src/routes/api/webhooks/mayar.$secret.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/routes/api/webhooks/mayar.%24secret.ts) |
| Instrument rendering | [`src/components/credit-checkout-dialog.tsx`](https://github.com/julianromli/imagenation-saas/blob/main/src/components/credit-checkout-dialog.tsx) |
| Scheduled reconcile | [`src/lib/scheduled.ts`](https://github.com/julianromli/imagenation-saas/blob/main/src/lib/scheduled.ts) |

The decisions and their reasons are in
[ADR-0021](https://github.com/julianromli/imagenation-saas/blob/main/docs/adr/0021-render-payment-instructions-in-our-own-ui.md).

## Related references

These files belong to the `mayar-v2` skill. Read them when you want the wider
playbook. This document does not depend on them:

- [API source map](https://github.com/mayarid/skills/blob/main/skills/mayar-v2/references/api-sources.md)
- [Stack pattern](https://github.com/mayarid/skills/blob/main/skills/mayar-v2/references/stack-pattern.md)
- [Webhook safety](https://github.com/mayarid/skills/blob/main/skills/mayar-v2/references/webhook-safety.md)
