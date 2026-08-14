# Native Checkout

Load this file only when Discover recorded `native`.

The application renders the payment instrument. Mayar issues the instrument
when create sets `paymentMethod`. An invoice without that field returns the
hosted `link` only.

## Schema

Read [Create Invoice](https://docs.mayar.id/api-reference-v2/invoice/create.md)
during Plan. Take the live `paymentMethod` list from that page. Do not copy a
remembered list.

[Create Single Payment Request](https://docs.mayar.id/api-reference-v2/reqpayment/create.md)
also documents `paymentMethod`. Use it only when Plan selected that endpoint.

No V2 page defines `paymentDetail`. Treat the create-response extra object as
untrusted input. The parser must never throw. Return `null` for an unknown
shape, then show the documented hosted `link`.

`GET /invoices/{id}` does not return `paymentDetail`. Store what the page needs
at create time.

Do not use `POST /qr-codes/create`. That page returns a URL and an amount. It
has no transaction ID and no `extraData`.

## Server contract

1. Keep a server-owned channel list that matches the live account.
2. Accept a channel code from the client. Validate it against that list.
3. Take price and product from server-owned data.
4. Write the order row before the Mayar create call.
5. Put the application order ID in `extraData`.
6. Pin `paymentMethod` to the validated channel.
7. Store `id`, `transactionId`, `link`, `expiredAt`, and the normalized
   instrument.
8. Return only the normalized instrument plus the fallback `link`.

Ask the user to confirm the active channels before you write the list. An
inactive channel fails at create time.

## Client contract

1. The buyer selects one channel in the application interface.
2. The page renders the QR string, the virtual account number, or a safe
   e-wallet action.
3. Validate every e-wallet URL scheme before it becomes a link. Permit `https:`
   and known wallet schemes only.
4. Show a countdown when the channel expiry is known. Channel expiry wins over
   invoice expiry.
5. Poll through the project server. Do not call Mayar from the browser.
6. Fall back to the hosted `link` when the parser returns `null`.

## Settlement and budget

The instrument is a rendering concern. It is never evidence of payment.

Use [webhook-safety.md](webhook-safety.md). Three paths must call one
settlement function: webhook, browser poll, and a scheduled job.

Grant access only after `GET /transactions/{id}` returns `paid`.

The API key allows 50 requests each minute. Claim the right to read before
every provider call. Suggested cadence: provider read every 15 seconds in the
first two minutes, then every 60 seconds. Stop after settlement.

A duplicate create for one customer at one amount returns `429` for about one
minute. Report the delay. Do not change the payload to bypass it.

## Order reuse

Key reuse on product and channel together. A buyer who changes channel needs a
new invoice. Leave a superseded pending order pending until its own expiry.
