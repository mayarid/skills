# Stack Pattern

Framework references adapt this contract. Endpoint schemas always come from
`references/api-sources.md`.

## Server contract

Each integration must provide:

1. A server-only `{ apiKey, environment }` configuration.
2. An HTTP helper that parses the V2 envelope.
3. A checkout route that validates input and returns `{ url }`.
4. A client CTA with loading and error states.
5. A redirect page for user interface feedback only.
6. A server-side webhook or polling process when fulfillment requires an
   asynchronous status.

A client-only SPA must use a server function or Worker.

## Minimal TypeScript helper

```ts
export type MayarEnvironment = "sandbox" | "production";

export interface MayarConfig {
  apiKey: string;
  environment: MayarEnvironment;
}

interface MayarEnvelope<T> {
  statusCode: number;
  messages?: string;
  message?: string;
  data?: T;
}

const BASE_URL: Record<MayarEnvironment, string> = {
  sandbox: "https://api.mayar.io/hl/v2",
  production: "https://api.mayar.id/hl/v2",
};

export class MayarApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "MayarApiError";
  }
}

export async function mayarFetch<T>(
  config: MayarConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${config.apiKey}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL[config.environment]}${path}`, {
    ...init,
    headers,
  });
  const body = (await response.json()) as MayarEnvelope<T>;
  const statusCode = body.statusCode ?? response.status;

  if (!response.ok || statusCode >= 400) {
    throw new MayarApiError(
      body.messages ?? body.message ?? `HTTP ${response.status}`,
      statusCode,
    );
  }

  return body.data as T;
}
```

Define request and response types from the endpoint page that you read in Phase
2. Do not create type fields from an old example.

## Environment adapter

Node reads environment variables at the server boundary:

```ts
export function getMayarConfig(): MayarConfig {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) throw new Error("MAYAR_API_KEY is not set");

  return {
    apiKey,
    environment:
      process.env.MAYAR_ENV === "production" ? "production" : "sandbox",
  };
}
```

Workers build the configuration from `env` bindings. Do not change
`process.env`.

## Checkout behavior

- Validate the product and price with server-owned data. Do not trust values
  from the client.
- Use a stable checkout identifier for idempotency.
- Handle documented `409`, `429`, and rate-limit responses.
- Return only required data to the client.
- Do not put the API key in a response or client bundle.

If the flow uses a webhook, implement the complete contract in
`references/webhook-safety.md`.
