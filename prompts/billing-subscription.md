Add a recurring subscription to this project with Mayar.

Goal:
- Let customers subscribe to a paid tier, keep access while they pay, and lose
  it when they stop.
- Follow the mayar-v2 skill instructions, read straight from the repository
  with no installation, so the endpoints come from the live Mayar V2
  documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

Sources, read them and install nothing:
- Skill directory: https://github.com/mayarid/skills/tree/main/skills/mayar-v2
- Skill entry point, raw:
  https://raw.githubusercontent.com/mayarid/skills/main/skills/mayar-v2/SKILL.md
- Mayar V2 documentation index: https://docs.mayar.id/llms.txt
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
   - My tiers, and the price of each one.
   - The billing period, and whether every tier uses the same one.
   - Exactly what an active member can reach that a non-member cannot.
   - What happens the moment a payment is missed, and after how long access
     ends.
   - Whether a member can change tier, and what happens to the current period.
   - Where membership state is stored in my system today, if anywhere.
6. A membership product and its tiers must exist in my Mayar account before
   any code runs. Create them for me with the skill's account commands after I
   approve the names and prices. Do not send me to the dashboard for this.
7. Follow the BUILD branch in SKILL.md, and every phase gate in it, exactly.
   Get my approval on the plan before you change any file. Cover the whole
   lifecycle in the plan: first payment, renewal for each new period, missed
   payment, and cancellation. Tell me early if my application must be
   reachable from the internet to receive payment notifications, and how to
   do that.
8. Verify in sandbox and report. Prove that a paid sandbox term grants the
   exact access I described, and that renewal does not create a second charge
   for the same period. Tell me which results you could not prove, list the
   environment variables I must set, and give me the steps to switch to a
   production key at https://web.mayar.id/api-keys.

Hard rules throughout:
- The API key is a secret. Only ever inspect it with a presence check
  (`${MAYAR_API_KEY:+set}`) or a command that returns a status. Never print,
  echo, cat, or grep-with-output any file or variable that may contain it, and
  never try to redact a key with a regex. If the key is ever exposed, tell me
  to rotate it immediately.
- Never write the key into project files, and never commit it.
- Take every endpoint, field, and error code from the live Mayar V2
  documentation that the skill resolves. Do not use remembered API shapes.
- Never bill the same member twice for one period, and never leave a paying
  member locked out. When you cannot prove which of the two a change causes,
  stop and ask me.
