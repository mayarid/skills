# React Vite and Cloudflare Workers Wiring

Read `references/stack-pattern.md` first.

A React Vite SPA does not have a server runtime. All Mayar requests, webhooks,
and fulfillment operations must use a small backend or Cloudflare Worker.

## Option A: Node/Hono backend

```text
src/                    # React client
server/index.ts         # checkout and webhook routes
server/mayar.ts         # helper
.env                    # server-only
```

The Vite development server can proxy `/api` to the local backend. Ask for
permission before you start a server or tunnel.

Minimum Hono route contract:

```ts
app.post("/api/checkout", async (context) => {
  return handleCheckout(context);
});

app.post("/api/webhooks/mayar", async (context) => {
  return handleWebhook(context);
});
```

The handlers are project functions. They implement validation, configuration
injection, and documented errors. The webhook handler must also implement
`references/webhook-safety.md`.

## Option B: Cloudflare Worker

Bindings:

```ts
interface Env {
  MAYAR_API_KEY: string;
  MAYAR_ENV: "sandbox" | "production";
  APP_URL: string;
}
```

Build `MayarConfig` directly from `env` in the handler:

```ts
const config: MayarConfig = {
  apiKey: env.MAYAR_API_KEY,
  environment: env.MAYAR_ENV,
};
```

Do not use or change `process.env` in a Worker. Store non-secret values as
variables. Store the API key as a secret binding.

## Client contract

The React CTA must:

- Be disabled while the request is active.
- Map an error response to a user message.
- Validate `url` before a redirect.
- Use the relative path `/api/checkout`.
- Never receive the API key, the authoritative amount, or fulfillment authority.
