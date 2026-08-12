# Install the Mayar Skill in Cursor

Install the official `mayar-v2` Agent Skill for Cursor, prove that this session
can see it, then stop. Do not start an integration. Do not require me to edit
this prompt.

## 1. Confirm the client

This prompt targets **Cursor** only. Confirm that you run in Cursor.

If you are a different client, stop and name the correct prompt:

| Client | Prompt |
|---|---|
| Claude Code | `prompts/install-claude-code.md` |
| Codex | `prompts/install-codex.md` |
| Hermes Agent | `prompts/install-hermes-agent.md` |
| OpenClaw | `prompts/install-openclaw.md` |
| Any other client | `prompts/install-mayar-v2.md` |

## 2. Install the skill

Run this command:

```bash
npx skills add mayarid/skills --skill mayar-v2 --agent cursor --global --yes
```

The command installs `mayar-v2` to `~/.cursor/skills/mayar-v2`. It reads the
current state of `https://github.com/mayarid/skills`. Use only that repository.

The `skills` CLI links each agent directory to one canonical copy. Keep that
default. Do not add `--copy`.

The command replaces an existing installation. Section 3 checks the result.

The CLI sends anonymous installation telemetry. To opt out, put
`DISABLE_TELEMETRY=1` in front of the command.

## 3. Check the installed files

Read the frontmatter of `~/.cursor/skills/mayar-v2/SKILL.md`. Confirm that
`name` is `mayar-v2`.

**Stop** if `SKILL.md` is absent, or if `name` is not `mayar-v2`. The
installation failed. Report the exact path and the problem.

The installation follows the `main` branch of `mayarid/skills`. Do not check
`metadata.version`.

## 4. Prove that Cursor sees the skill

Run this command, and only this command:

```bash
npx skills list
```

Confirm that `mayar-v2` appears for `cursor`. Do not list the directory, do not
run a second listing, and do not add your own checks.

Cursor discovers skills from its skill directories when it starts. If the skill
does not appear in the client, tell me to restart Cursor.

This command proves that the files are in place. It does not prove that Cursor
loaded them. Only I can confirm that, and Section 5 tells you how to ask.

## 5. Report, then ask what I want to do

Tell me in two plain sentences where you installed the skill and that `SKILL.md`
is present and correct. Do not print a checklist of section numbers.

Then write this line, in your own words:

> Open **Customize** in the sidebar, go to **Skills**, and check that `mayar-v2`
> is listed. Tell me if it is missing.

That line is required. It is the only proof that Cursor loaded the skill, and
only I can give it to you. Never write that the client check passed.

Then stop. Do not read the skill body. Do not start an integration.

Now tell me in one sentence what Mayar does: it accepts QRIS, virtual accounts,
e-wallets, and cards from buyers in Indonesia.

Then ask me one question:

> What do you want to do with Mayar?

Then give me five example sentences that I can copy and send back. Write each
one as a goal in my own words. Do not use endpoint names, model names, or file
names. Put them in two labelled groups, exactly like this:

Build something:

```
I sell an ebook. Add a checkout to my site.
Let people subscribe monthly for premium content.
Users buy credit, and each AI request spends some of it.
```

Check your account:

```
Show my Mayar balance.
Show today's transactions.
```

Say that the first group changes my application, and that the second group only
reads my Mayar account. Put the requirement for the second group next to that
group, not on its own: it needs Node.js 18 or later and one sign-in with
`npx -y mayar@latest login`.

Close with one line: ready-made prompts for a specific sales model are in
[`prompts/`](https://github.com/mayarid/skills/tree/main/prompts). Do not list
their file names. Do not invent names for them.
