# Mayar V2 API Sources

Use this file when Phase 2 requires API facts. This file is a source map. It is
not a schema snapshot.

## Retrieval

1. Fetch [`https://docs.mayar.id/llms.txt`](https://docs.mayar.id/llms.txt).
2. Select a page under `/api-reference-v2/`.
3. Fetch the endpoint `.md` URL.
4. Get the method, path, request, response, and errors from that page.

Do not use V1 documentation, model memory, CLI cache, or old test results as a
BUILD schema source. Use CLI `--help` only for CLI syntax.

## Fallback order

Use this order. Do not skip a step, and do not start at a later step.

1. `llms.txt`, then the endpoint `.md` URL. This is the normal path.
2. The endpoint `.md` URL directly, when `llms.txt` is unreachable but the page
   path is already known.
3. Last option only: fetch [`https://docs.mayar.id`](https://docs.mayar.id) with
   a web tool and navigate to the V2 page. Use this step only after steps 1 and
   2 fail.

Step 3 is expensive. One documentation page as HTML is approximately 86 times
the size of the same `.md` page. Read one page, take only the fields that the
task requires, and tell the user that you used the fallback.

If step 3 also fails, stop and report the blocker. Do not estimate a field.

## Stable transport invariants

Source: [V2 Introduction](https://docs.mayar.id/api-reference-v2/introduction.md).

- Production: `https://api.mayar.id/hl/v2`
- Sandbox: `https://api.mayar.io/hl/v2`
- Send the Bearer API key in the `Authorization` header.
- The V2 envelope uses `statusCode`, `messages`, and `data`. Some write
  endpoints specify the singular field `message`.

The client must check the HTTP status and `body.statusCode`. It must read
`body.messages ?? body.message`.

## Error distinctions

- [Create Payment Link](https://docs.mayar.id/api-reference-v2/genericlink/createpaymentlink.md):
  `409` and `already exist` indicate a product identifier conflict.
- [Create Invoice](https://docs.mayar.id/api-reference-v2/invoice/create.md):
  `409` indicates an invoice identifier conflict. `429` indicates a duplicate
  create request and requires a one-minute delay.
- [Rate Limit](https://docs.mayar.id/api-reference-v2/rate-limit.md):
  The limit is 50 requests per minute for each API key. Follow `Retry-After`
  when the request exceeds the limit.

Do not change the payload randomly to bypass duplicate detection. Use a stable
application checkout ID and project idempotency.

## Conditional pages

Find the current page through `llms.txt`. Relevant page groups include:

- payment link: `genericlink/createpaymentlink.md`;
- invoice: `invoice/create.md` and `invoice/detail.md`;
- transaction: `transaction/detail.md`;
- credit wallet: pages under `credit/`;
- membership: pages under `membership/`;
- webhook operations: pages under `webhook/`;
- license: pages under `saas/` or `software/`.

Read field lists such as `paymentMethod` from the endpoint page during the task.
Do not copy these lists to a local reference.

Checkout type does not change the source map. `hosted` and `embedded` use
`data.link`. `native` also reads `paymentMethod` from the same create page.
There is no embed or `paymentDetail` page in `llms.txt`.
