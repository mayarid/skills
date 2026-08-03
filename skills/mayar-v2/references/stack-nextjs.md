# Next.js App Router Wiring

Read `references/stack-pattern.md` first. Match the import aliases and Next.js
version to the project.

## File placement

```text
lib/mayar.ts
lib/mayar-config.ts
app/api/checkout/route.ts
app/api/webhooks/mayar/route.ts   # only when required
app/.../BuyButton.tsx
```

Store environment variables in `.env.local`. Make sure that `.gitignore`
excludes `.env*`.

## Checkout route

The Route Handler must call the helper with server-only configuration. It must
get the product and amount from trusted server data. It then returns the hosted
URL.

```ts
import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/mayar";
import { getMayarConfig } from "@/lib/mayar-config";

export async function POST(request: Request) {
  try {
    const input = await validateCheckoutRequest(request);
    const checkout = await createCheckout(getMayarConfig(), input);
    return NextResponse.json({ url: checkout.link });
  } catch (error) {
    return checkoutErrorResponse(error);
  }
}
```

Implement `validateCheckoutRequest`, `createCheckout`, and
`checkoutErrorResponse` from the schema and error documentation selected in
Phase 2. These names define a project contract. They are not functions in a
Mayar library.

## Client CTA

The client component must call only `/api/checkout`. It must show loading and
error states. It must verify a successful response and a valid URL before it
calls `window.location.assign(url)`.

## Webhook

The `app/api/webhooks/mayar/route.ts` route must adapt
`references/webhook-safety.md` to the project database or ORM. Before a verified
transaction ID mapping is available, the route must only audit the event. It
must not run fulfillment.
