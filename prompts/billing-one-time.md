Add a one-time payment checkout to this project with Mayar.

Goal:
- Let a buyer pay once for a product and get access immediately after payment.
- Use the mayar-v2 agent skill for the whole build, so the endpoints come from
  the live Mayar V2 documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

Skill source:
- Repository: https://github.com/mayarid/skills
- Install command: npx skills add mayarid/skills
- Strict alternative, when you need a pinned release with checksum validation:
  https://github.com/mayarid/skills/blob/main/prompts/install-and-integrate-mayar-v2.md

What to do:
1. Install the skill FIRST, before any key setup. Check whether mayar-v2 is
   already available to this agent. If it is not, run:
   npx skills add mayarid/skills
   Then confirm that the skill's SKILL.md, playbook/, and references/ exist.
   Do not download a single file by hand — mayar-v2 is a multi-file skill.
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
   - What I sell, and the price and currency.
   - What the buyer gets after payment, and how it reaches them.
   - Where the buyer should land after payment.
   - Where access is stored today, if anywhere.
   - Which page or button should start the purchase.
6. Run the skill's BUILD branch and follow every phase gate exactly. Get my
   approval on the plan before you change any file. Create any Mayar account
   object yourself — do not send me to the dashboard for a task you can do.
   This flow confirms payment through a webhook, so tell me early if my
   application needs to be reachable from the internet, and how to do that.
7. Verify in sandbox and report. Tell me exactly which results you proved and
   which you could not, list the environment variables I must set, and give me
   the steps to switch to a production key at https://web.mayar.id/api-keys.

Hard rules throughout:
- The API key is a secret. Only ever inspect it with a presence check
  (`${MAYAR_API_KEY:+set}`) or a command that returns a status. Never print,
  echo, cat, or grep-with-output any file or variable that may contain it, and
  never try to redact a key with a regex. If the key is ever exposed, tell me
  to rotate it immediately.
- Never write the key into project files, and never commit it.
- Take every endpoint, field, and error code from the live Mayar V2
  documentation that the skill resolves. Do not use remembered API shapes.
- Deliver the product one time only. A repeated payment notification must not
  send it twice.
