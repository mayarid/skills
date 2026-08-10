Add itemized invoice billing to this project with Mayar.

Goal:
- Let me bill a named client for itemized work and send them a payment link.
- Follow the mayar-v2 skill instructions, read straight from the repository
  with no installation, so the endpoints come from the live Mayar V2
  documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

Sources, read them and install nothing:
- Skill directory: https://github.com/mayarid/skills/tree/main/skills/mayar-v2
- Skill entry point, raw:
  https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/SKILL.md
- The skill sends you to the Mayar V2 documentation index at
  https://docs.mayar.id/llms.txt for every endpoint fact. Do not start there
  and skip the skill: the skill holds the phase gates, the fulfillment rules,
  and the webhook safety rules that the documentation does not carry.
- Optional, only if I will repeat this work often, I can install the skill
  instead by following
  https://github.com/mayarid/skills/blob/main/prompts/install-and-integrate-mayar-v2.md

Shell note:
- The commands below are POSIX shell, for bash or zsh. If your shell is
  PowerShell, cmd, or fish, translate them before you run them. That includes
  the presence test in step 2, the `export` in step 3, and the inline
  `MAYAR_API_URL=...` prefix in step 4. Keep the rule intact in every
  translation: never print the key.

What to do:
1. Read the skill FIRST, before any key setup. Install nothing. Fetch
   https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/SKILL.md
   and follow it exactly. It is a router: it names the file to read for each
   phase. Resolve every relative link in it against that same directory, for
   example playbook/discover.md and ../references/api-sources.md, and fetch
   each file when the phase needs it.
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
3. Only if no key resolves anywhere, set one up WITHOUT hand-editing any shell
   profile and WITHOUT pasting the key into this chat. Tell me to create a
   SANDBOX key at https://web.mayar.io/api-keys, then export MAYAR_API_KEY in
   my own terminal. Use the sandbox key for the whole build. Wait for me to
   confirm before you continue.
4. Smoke-test the key from your own shell with the official CLI, which never
   prints the key:
   MAYAR_API_URL=https://api.mayar.io/hl/v2 npx -y mayar@latest --sandbox balance
   It must return a balance, not an authentication error.
5. Ask me these before you write any plan, one question per message. Do not
   guess an answer and do not infer an entitlement rule or a database change:
   - What I bill for, and what a typical invoice line looks like.
   - Whether I charge tax, and how it is calculated.
   - How long a client has to pay before the invoice expires.
   - Who creates an invoice in my application, and from which screen.
   - How the client receives the invoice link.
   - What must change in my system once an invoice is paid.
6. Follow the BUILD branch in SKILL.md, and every phase gate in it, exactly.
   Get my approval on the plan before you change any file. An invoice returns
   its own transaction identifier at creation, so ask me whether I want paid
   status checked on demand or pushed by webhook, and explain the trade-off
   before I choose. Do not create a duplicate invoice for the same job — use a
   stable identifier from my application.
7. Verify in sandbox and report. Prove that a sandbox payment moves the
   invoice to paid and updates my system once. Tell me which results you could
   not prove, list the environment variables I must set, and give me the steps
   to switch to a production key at https://web.mayar.id/api-keys.

Hard rules throughout:
- The API key is a secret. Only ever inspect it with a presence check
  (`${MAYAR_API_KEY:+set}`) or a command that returns a status. Never print,
  echo, cat, or grep-with-output any file or variable that may contain it, and
  never try to redact a key with a regex. If the key is ever exposed, tell me
  to rotate it immediately.
- Never write the key into project files, and never commit it.
- Take every endpoint, field, and error code from the live Mayar V2
  documentation that the skill resolves. Do not use remembered API shapes.
- Never change an invoice payload at random to get past a duplicate error.
  Find out what the duplicate means first, then fix the cause.
