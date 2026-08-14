# Embedded Checkout

Load this file only when Discover recorded `embedded`.

The server matches `hosted`. The client does not redirect. It opens an overlay
and loads the documented checkout `link` in an iframe.

## Schema

Read the create page selected in Plan. The field you embed is `data.link` on
payment link and invoice, or `data.checkoutLink` on immutable credit checkout.
Validate the live page. Do not remember the field name.

Do not send extra embed fields. The V2 pages define none.

`redirectUrl` is documented on payment-link create. It is user-interface
feedback after payment. It grants nothing.

## Client contract

1. Call only the project checkout route.
2. Show loading and documented errors.
3. Accept `{ url }`. Reject any value that is not an `https:` URL.
4. Open a modal overlay on the current page. Do not change `window.location`.
5. Set the iframe `src` to `url`.
6. Give the iframe a title and a close control.
7. If the iframe stays blank, or the browser blocks it, offer a fallback
   control that assigns `window.location` to the same `url`.
8. When Mayar sends the buyer to `redirectUrl`, close the overlay and show a
   pending state. Do not grant access.

Do not load `https://mayar.id/mayar-min.js`. That script is not in the V2
documentation and has returned `404`.

Do not copy a dashboard HTML snippet as the BUILD path. Dashboard paste is a
no-code option. BUILD creates the `link` through the API, then embeds it.

## Host and CSP

Permit the checkout host in the application `frame-src` / `child-src` policy
before you ship. Read the host from the returned `url`. Do not hard-code a
remembered Mayar hostname.

If the application CSP blocks the iframe, either widen `frame-src` or fall
back to `hosted`.

## Settlement

The overlay is not evidence of payment. A closed modal is not evidence. Use
[webhook-safety.md](webhook-safety.md) when fulfillment is asynchronous.

Grant access only after `GET /transactions/{id}` returns `paid`.

## Failure modes

| Symptom | Action |
|---|---|
| Iframe is blank | Show the hosted fallback for the same `url` |
| E-wallet or 3-D Secure leaves the frame | Keep the pending state. Continue settlement |
| `redirectUrl` replaces the iframe document | Detect the return path, close the overlay, do not grant |
| User closes the overlay | Leave the order pending. Do not expire it early |
