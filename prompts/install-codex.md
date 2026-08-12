# Install the Mayar Skill in Codex

Install the official `mayar-v2` Agent Skill for Codex, prove that this session
can see it, then stop. Do not start an integration. Do not require me to edit
this prompt.

## 1. Confirm the client

This prompt targets **Codex** only. Confirm that you run in Codex.

If you are a different client, stop and name the correct prompt:

| Client | Prompt |
|---|---|
| Claude Code | `prompts/install-claude-code.md` |
| Cursor | `prompts/install-cursor.md` |
| Hermes Agent | `prompts/install-hermes-agent.md` |
| OpenClaw | `prompts/install-openclaw.md` |
| Any other client | `prompts/install-mayar-v2.md` |

## 2. Install the skill

Codex is the one client that does not use the `skills` CLI here. The CLI writes
Codex user skills to `~/.codex/skills/`. The Codex documentation lists
`$HOME/.agents/skills` as its user location. Copy the skill there directly.

Run these commands:

```bash
git clone --depth 1 https://github.com/mayarid/skills /tmp/mayar-skills
mkdir -p ~/.agents/skills
rm -rf ~/.agents/skills/mayar-v2
cp -R /tmp/mayar-skills/skills/mayar-v2 ~/.agents/skills/mayar-v2
rm -rf /tmp/mayar-skills
```

The commands install `mayar-v2` to `~/.agents/skills/mayar-v2`. Use only
`https://github.com/mayarid/skills`.

The commands replace an existing installation. Section 3 checks the result.

## 3. Check the installed files

Read the frontmatter of `~/.agents/skills/mayar-v2/SKILL.md`. Confirm that
`name` is `mayar-v2`.

**Stop** if `SKILL.md` is absent, or if `name` is not `mayar-v2`. The
installation failed. Report the exact path and the problem.

The installation follows the `main` branch of `mayarid/skills`. Do not check
`metadata.version`.

## 4. Prove that Codex sees the skill

The `skills` CLI did not perform this installation, so `npx skills list` will
not report it. The file check in Section 3 is the only machine check. Do not run
a second listing, and do not add your own checks.

Codex reads user skills from `$HOME/.agents/skills`. It detects a new skill on
its own. If the skill does not appear in the client, tell me to restart Codex.

The file check proves that the files are in place. It does not prove that Codex
loaded them. Only I can confirm that, and Section 5 tells you how to ask.

## 5. Report, then ask what I want to do

Tell me in two plain sentences where you installed the skill and that `SKILL.md`
is present and correct. Do not print a checklist of section numbers.

Then write this line, in your own words:

> Run `/skills`, or type `$`, and check that `mayar-v2` is listed. Tell me if it
> is missing.

That line is required. It is the only proof that Codex loaded the skill, and
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
