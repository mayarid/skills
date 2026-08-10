Add installment billing to this project with Mayar.

Goal:
- Let a customer pay a large price across several months, with one payment
  link per month and a clear due date.
- Follow the mayar-v2 skill instructions, read straight from the repository
  with no installation, so the endpoints come from the live Mayar V2
  documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

Known limit, read this before you start:
- Installment billing is newer than the mayar-v2 skill. The skill's interview
  does not list it as a sales model, so it will ask more questions than usual
  and it must read the installment pages in the live documentation from
  scratch. Expect a slower planning phase.
- Treat the live documentation as the only source for the allowed number of
  months, the allowed due dates, and how interest is applied. Do not accept a
  remembered range.

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
5. Read the installment pages in the live Mayar V2 documentation before you
   ask me anything about terms. Then tell me the allowed range of months, the
   allowed due dates, and how interest is charged, so I choose inside the real
   limits instead of guessing.
6. Ask me these before you write any plan, one question per message. Do not
   guess an answer and do not infer an entitlement rule or a database change:
   - What I sell, and the full price before it is split.
   - How many months I want to offer, and the interest I charge.
   - Which day of the month the payment is due.
   - What the buyer gets immediately, and what they get only after the last
     payment.
   - What happens when a monthly payment is late or missed.
   - Where I track who is still paying, if anywhere.
7. Follow the BUILD branch in SKILL.md, and every phase gate in it, exactly.
   Get my approval on the plan before you change any file. One plan produces
   many monthly payments, so the plan must say how my system reacts to each
   one, not only to the first. Tell me early if my application must be
   reachable from the internet to receive payment notifications, and how to
   do that.
8. Verify in sandbox and report. Prove that the plan is created with the
   correct number of months and the correct total, and that a payment for one
   month updates my system once. Say clearly that later months are not
   verified inside a sandbox session, and how I should watch them in
   production. List the environment variables I must set, and give me the
   steps to switch to a production key at https://web.mayar.id/api-keys.

Hard rules throughout:
- The API key is a secret. Only ever inspect it with a presence check
  (`${MAYAR_API_KEY:+set}`) or a command that returns a status. Never print,
  echo, cat, or grep-with-output any file or variable that may contain it, and
  never try to redact a key with a regex. If the key is ever exposed, tell me
  to rotate it immediately.
- Never write the key into project files, and never commit it.
- Take every endpoint, field, and error code from the live Mayar V2
  documentation that the skill resolves. Do not use remembered API shapes.
- Never create a second payment plan for the same purchase. If a create call
  reports a duplicate, find the existing plan first and show it to me.
