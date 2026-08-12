# Mayar Product Knowledge

Use this file only for the LEARN branch. Answer from the documentation. Do not
answer from model memory.

## Retrieval

1. Fetch [`https://docs.mayar.id/llms.txt`](https://docs.mayar.id/llms.txt).
2. Select the page that matches the question. Product knowledge is outside
   `/api-reference-v2/`.
3. Fetch that `.md` page.
4. Answer from that page, and name the page that you used.

Use the fallback order in [api-sources.md](api-sources.md) when a page is
unreachable.

## Page groups

- `features/` — dashboard, analytics, balance, order, discount, bundling,
  cross-sell, affiliate, broadcast, customer management, customer portal,
  checkout setting, payment method setting, landing page, and custom form.
- `features/productpage/` — one page for each product type, including ebook,
  online course, membership, event, coaching, bootcamp, fundraising, and
  software license.
- `onlinepaymentmethod` — accepted payment methods.
- `accountsetup` and `businessverify` — account opening and verification.
- `mor/` — merchant of record.
- `integration/` — third-party integrations.

## Answer rules

Answer only what a page states. If a fee, limit, or feature is not on a page,
say that the documentation does not state it. Do not estimate a number.

State the branch limit when it applies. This branch reads documentation only.
It does not read the user's Mayar account. Send the user to the OPS branch for
their own balance, products, or transactions.

## Comparison with another provider

The documentation describes Mayar only. It contains no page about another
payment provider.

For a comparison question, describe what Mayar does from the documentation, and
name the pages. Do not describe, rank, or price another provider from memory.
Tell the user to read that provider's own documentation for its side.

Do not claim that Mayar is better, cheaper, or faster than another service. That
claim is not in the documentation.

## When the documentation has no answer

Say so plainly. Offer the closest documented page. Send the user to
[mayar.id](https://mayar.id) or Mayar support for commercial terms, pricing
negotiation, or account status.
