# Phase 3: Implement

In this phase, implement the approved plan. Keep secrets on the server. Use
failure controls that are suitable for payment operations.

## Set up BUILD

Use sandbox by default:

- API: `https://api.mayar.io/hl/v2`
- API key: `https://web.mayar.io/api-keys`

Production uses `https://api.mayar.id/hl/v2` and a key from
`https://web.mayar.id/api-keys`.

Store the key in a server-only environment variable. Make sure that `.gitignore`
excludes the environment file. To verify CLI authentication, run
`npx -y mayar@latest whoami --json`.

## Load references conditionally

Always read `references/stack-pattern.md`. Then read one wiring reference:

- `references/stack-nextjs.md`
- `references/stack-tanstack-start.md`
- `references/stack-vite-react.md`

For another stack, adapt the generic contract to the project runtime. If the
flow uses a webhook or asynchronous fulfillment, read
`references/webhook-safety.md` before you write the handler.

## Implement approved scope

- Implement each file in the plan, not only the Mayar helper.
- Put API calls, the key, and fulfillment in the server runtime.
- Add a server function or Worker for a client-only SPA.
- Add loading, documented error, and redirect states to the UI.
- Use the redirect only for the user interface. Grant access only after payment
  status verification.
- Compare each request and response with the documentation selected in Phase 2.
- Use persistent storage and database transactions that match the project
  model.

Run the formatter, build, type check, and relevant tests. Ask for permission
before you start a development server.

## Completion criterion

This phase is complete only when:

- Each planned file and state transition is implemented.
- The key is not in the client bundle or tracked source.
- A webhook flow complies with `references/webhook-safety.md`.
- The formatter, build, type check, and relevant tests pass. If a definitive
  blocker exists, report it with evidence.

When all conditions are true, return to `SKILL.md` and open Phase 4.
