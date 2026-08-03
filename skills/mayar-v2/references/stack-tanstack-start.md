# TanStack Start Wiring

Read `references/stack-pattern.md` first. The TanStack Start server-route API can
change between releases. Inspect the project dependency version. Match the
handler to the documentation for that version before you write code.

## File placement

```text
src/lib/mayar.ts
src/lib/mayar-config.ts
src/routes/api/checkout.ts
src/routes/api/webhooks/mayar.ts   # only when required
src/.../BuyButton.tsx
```

## Route contract

The checkout server route must:

1. Accept `POST`.
2. Validate the request against trusted product data.
3. Build configuration from server environment variables.
4. Call the endpoint helper selected in Phase 2.
5. Return `{ url }` or a mapped error response.

If the project version uses `createFileRoute` with `server.handlers`, use this
minimum structure:

```ts
export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => handleCheckout(request),
    },
  },
});
```

`handleCheckout` is a project function that implements the contract in
`references/stack-pattern.md`. It is not a TanStack or Mayar API.

## Client and webhook

The CTA calls the checkout route and shows loading and error states. It redirects
only after URL validation. The webhook route uses the same server-handler
structure. Its evidence gate and persistent data must comply with
`references/webhook-safety.md`.
