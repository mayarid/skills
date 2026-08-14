Add a custom native checkout to this project with Mayar, in production.

Goal:
- Keep the buyer inside my application for the whole payment. The QR code, the
  virtual account number, and the e-wallet link all render in my own user
  interface. No redirect to a Mayar hosted page, except as a fallback.
- Build it against PRODUCTION only. No sandbox. Real money moves on the first
  test.
- Follow the mayar-v2 skill instructions, read straight from the repository
  with no installation, so the endpoints come from the live Mayar V2
  documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

How this checkout works, so you do not pick the wrong endpoint:
- The instrument comes from `POST /invoices/create` with `paymentMethod`
  pinned to one channel. Mayar then returns `paymentDetail` on the create
  response, and that field carries the QR string, the virtual account number,
  or the e-wallet action links.
- `paymentDetail` is on the create response ONLY. `GET /invoices/{id}` does not
  return it. Store what my page needs at create time.
- Do not use `POST /qr-codes/create`. It returns a URL and an amount only, with
  no transaction identifier and no `extraData`, so a payment made through it
  cannot be tied back to my order.

Known limits, read these before you start:
- `paymentDetail` is undocumented. No Mayar V2 page defines its shape. Treat it
  as untrusted input, never let the parser throw, and fall back to the
  documented hosted `link` for anything you do not recognise.
- Every channel I offer must already be active on my Mayar account. An
  inactive channel does not fail in my channel list, it fails at create time.
  Ask me to confirm the active channels before you write the list.
- Mayar sends no webhook signature. A webhook payload and a browser redirect
  are notifications, not proof of payment. Only a transaction I read back
  myself can grant anything.
- The API key allows 50 requests a minute for everything my application does,
  and a native checkout polls. Treat that budget as a design constraint, not
  as an afterthought.
- Production means a real charge. Plan the smallest possible amount for the
  end-to-end test, and tell me the amount before you create anything.

Sources, read them and install nothing:
- Skill directory: https://github.com/mayarid/skills/tree/main/skills/mayar-v2
- Skill entry point, raw:
  https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/SKILL.md
- Native checkout reference, raw. Read this one in full before you plan, it
  carries the parsing rules, the request budget, and the settlement gate that
  this flow needs:
  https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/references/checkout-native.md
- The skill sends you to the Mayar V2 documentation index at
  https://docs.mayar.id/llms.txt for every endpoint fact. Do not start there
  and skip the skill: the skill holds the phase gates, the fulfillment rules,
  and the webhook safety rules that the documentation does not carry.
- Optional, only if I will repeat this work often, I can install the skill
  instead by following
  https://github.com/mayarid/skills/blob/main/prompts/install-mayar-v2.md

Shell note:
- The commands below are POSIX shell, for bash or zsh. If your shell is
  PowerShell, cmd, or fish, translate them before you run them. That includes
  the presence test in step 2 and the `export` in step 3. Keep the rule intact
  in every translation: never print the key.

What to do:
1. Read the skill FIRST, before any key setup. Install nothing. Fetch
   https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/SKILL.md
   and follow it exactly. It is a router: it names the file to read for each
   phase. Resolve every relative link in it against that same directory, for
   example playbook/discover.md and ../references/api-sources.md, and fetch
   each file when the phase needs it. Fetch the native checkout reference
   listed above as well.
   Nothing is stored on my machine, so this applies to the current session
   only. Fetch a file again if you lose it.
2. Check whether a Mayar API key is already available FROM YOUR OWN
   COMMAND-RUNNING ENVIRONMENT — use the same shell you will run the build
   with, not by asking me to echo it:
   printf '%s\n' "${MAYAR_API_KEY:+env-set}"
   Your shell is likely non-interactive and does NOT source interactive
   profiles like ~/.zshrc or ~/.bashrc, so a key I set there can look present
   to me and empty to you. If nothing shows, find which file defines it
   WITHOUT printing its value:
   grep -l MAYAR_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null
   That lists names only. NEVER run a plain grep, cat, or echo on a profile —
   an `export MAYAR_API_KEY=...` line would leak the secret into our chat.
   Then `source` that file inside your command, re-run the presence test, and
   prepend the same `source ...;` to every later command that needs the key.
   A key that resolves may still be a sandbox key. Confirm with step 4 before
   you trust it.
3. Only if no key resolves anywhere, set one up WITHOUT hand-editing any shell
   profile and WITHOUT pasting the key into this chat. Tell me to create a
   PRODUCTION key at https://web.mayar.id/api-keys, then export MAYAR_API_KEY
   in my own terminal. Wait for me to confirm before you continue.
4. Smoke-test the key against PRODUCTION from your own shell with the official
   CLI, which never prints the key:
   npx -y mayar@latest --production balance
   The `--production` flag beats any saved CLI configuration, so it also tells
   me whether the key that resolved in step 2 is really a production key. It
   must return a balance, not an authentication error. If it fails, stop and
   tell me. Do not fall back to sandbox to make the command pass.
5. Ask me these before you write any plan, one question per message. Do not
   guess an answer, and do not infer a fulfillment rule or a database change:
   - What I sell, and where the buy button lives today.
   - Which payment channels are active on my Mayar account, and which of them
     I want to offer.
   - How long one payment stays valid, and what my page shows when it expires.
   - What the buyer receives after payment, and which record in my database
     changes to give it.
   - What my page shows while the payment is pending, and after it succeeds.
   - Whether my project already has a background job or a cron trigger I can
     use to settle a payment whose webhook never arrived.
6. Follow the BUILD branch in SKILL.md, and every phase gate in it, exactly,
   with two overrides for this job:
   - Environment is production everywhere. The skill defaults the BUILD branch
     to sandbox. Ignore that default here, and use
     https://api.mayar.id/hl/v2 throughout.
   - The build is not finished at the create call. It also needs the
     instrument rendering, the settlement gate, and the read-back throttle
     from the native checkout reference.
   Get my approval on the plan before you change any file. The plan must state
   the exact fulfillment operation in my own database, in words I can check.
7. Verify with ONE small real payment, and report. There is no sandbox in this
   job, so the evidence is a production transaction. Before you create it,
   tell me the amount and wait for me to agree. Then prove, in this order:
   - The create call returns an instrument, and my page renders it.
   - The payment reaches `paid` on `GET /transactions/{id}`.
   - My database record changed exactly once.
   - A repeated webhook delivery changes nothing a second time.
   Finish with the environment variables I must set, the webhook URL I must
   register, and anything left unverified.

Hard rules throughout:
- The API key is a secret. Only ever inspect it with a presence check
  (`${MAYAR_API_KEY:+set}`) or a command that returns a status. Never print,
  echo, cat, or grep-with-output any file or variable that may contain it, and
  never try to redact a key with a regex. If the key is ever exposed, tell me
  to rotate it immediately.
- Never write the key into project files, and never commit it. The key is
  server-side only. It must never reach the client bundle or a response body.
- Take every endpoint, field, and error code from the live Mayar V2
  documentation that the skill resolves. Do not use remembered API shapes.
  That includes the `paymentMethod` values: read the current list from the
  invoice create page.
- Nothing but a `paid` status on a transaction I fetched myself may grant
  access. Not a webhook payload, not a redirect, not a rendered QR code.
- Every e-wallet URL must pass a scheme allowlist before it reaches a link in
  my page. An unchecked provider URL in an `href` is a stored cross-site
  scripting hole.
- Write my order row before the create call, and put my own order identifier
  in `extraData`. Read that identifier back from the transaction, never from a
  webhook payload.
- Claim the right to read before every call to Mayar, so several browser tabs
  and the background job produce one request between them. Respect
  `Retry-After` on 429.
- Never invent a confirmation mechanism, and never work around a duplicate
  create by changing the payload at random. If something is undocumented, tell
  me it is undocumented and let me decide.
