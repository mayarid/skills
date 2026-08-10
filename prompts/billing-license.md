Add software license activation to this project with Mayar.

Goal:
- Sell my software with a license code that the customer activates, and let my
  application check that the license is still valid.
- Use the mayar-v2 agent skill for the whole build, so the endpoints come from
  the live Mayar V2 documentation instead of guesswork.
- Get a Mayar API key working WITHOUT ever exposing, printing, or pasting the
  key into this chat.

Skill source:
- Repository: https://github.com/mayarid/skills
- Install command: npx skills add mayarid/skills
- Strict alternative, when you need a pinned release with checksum validation:
  https://github.com/mayarid/skills/blob/main/prompts/install-and-integrate-mayar-v2.md

Shell note:
- The commands below are POSIX shell, for bash or zsh. If your shell is
  PowerShell, cmd, or fish, translate them before you run them. That includes
  the presence test in step 2, the `export` in step 3, and the inline
  `MAYAR_API_URL=...` prefix in step 4. Keep the rule intact in every
  translation: never print the key.

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
   - What the license unlocks, and what the software does without one.
   - Where the customer enters the license code.
   - Whether one license covers one device, one account, or several.
   - How often my application should re-check the license, and what it does
     while offline.
   - What happens when a license expires or is turned off.
   - Whether I sell the license separately or bundled with a subscription.
6. A license product must exist in my Mayar account before any code runs, and
   license codes are issued against it. Create the product for me with the
   skill's account commands after I approve its name and price, then tell me
   how a test license code is issued in sandbox.
7. Run the skill's BUILD branch and follow every phase gate exactly. Get my
   approval on the plan before you change any file. Note that Mayar's license
   endpoints do not share the base path used by the rest of the V2 API — read
   the licensing pages in the live documentation and use the exact base they
   specify. Do not assume it matches the other endpoints.
8. Verify in sandbox and report. Prove that activating a code unlocks the
   software, that verification reports the correct status and expiry, and that
   a turned-off license locks the software again. Tell me which results you
   could not prove, list the environment variables I must set, and give me the
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
- Never put my API key in code that ships to a customer's machine. License
  checks that need the key must run on my server.
