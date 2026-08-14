# Checkout Types

Read this file before you ask the checkout-type question in Discover. Record
exactly one value: `hosted`, `embedded`, or `native`.

The sales model selects the endpoint. The checkout type selects the buyer
presentation. Do not mix the two.

## Documentation status

Fetched from [`https://docs.mayar.id/llms.txt`](https://docs.mayar.id/llms.txt)
on 2026-08-14. The index has no page for embed, iframe, overlay, lightbox,
widget, hosted checkout, or native checkout.

Documented API facts that all three types share:

- [Create Payment Link](https://docs.mayar.id/api-reference-v2/genericlink/createpaymentlink.md)
  returns `data.link`. `redirectUrl` is a request field.
- [Create Invoice](https://docs.mayar.id/api-reference-v2/invoice/create.md)
  returns `data.link`. The page also defines `paymentMethod`.
- [Create Single Payment Request](https://docs.mayar.id/api-reference-v2/reqpayment/create.md)
  returns `data.link` and also defines `paymentMethod`.
- [Transaction detail](https://docs.mayar.id/api-reference-v2/transaction/detail.md)
  is the evidence of payment.

Not on any V2 page:

- An embed, iframe, or overlay API.
- A field named `paymentDetail`.
- A checkout-type enum.

A Mayar engineer stated that the API checkout `link` is the URL to embed. Treat
that as presentation guidance. Do not invent request or response fields from
it. LEARN answers must not cite the engineer. LEARN answers only what a
documentation page states.

## Decision

Does the buyer leave the merchant site?

- Yes → `hosted`. Recommended. Fully documented `link` plus redirect.
- No, and Mayar still owns the payment form → `embedded`. Overlay loads `link`.
- No, and the application owns the payment form → `native`. Pin `paymentMethod`.

If the user says "stay on the site" and does not pick a form owner, ask
`embedded` versus `native`. Do not choose for them.

| Type | Buyer stays | Who renders the form | Documented field | Extra reference |
|---|---|---|---|---|
| `hosted` | No | Mayar page | `link` | None. Use the stack redirect. |
| `embedded` | Yes | Mayar page in an overlay | `link` | [checkout-embedded.md](checkout-embedded.md) |
| `native` | Yes | The application | `paymentMethod` | [checkout-native.md](checkout-native.md) |

## Recommendation

Recommend `hosted` unless the user already refused a redirect. It needs the
least client code and uses only documented fields.

Recommend `embedded` when the user wants to stay on the site and still use the
Mayar form.

Recommend `native` only when the user will render QR codes, virtual accounts,
or e-wallet actions in their own interface.
