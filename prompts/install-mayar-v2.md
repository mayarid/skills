# Install the Mayar Skill

Install the official `mayar-v2` Agent Skill for the client that you run in,
prove that this session can see it, then stop. Do not start an integration. Do
not require me to edit this prompt.

## 1. Check for a client-specific prompt

Five clients have their own prompt. Each one hardcodes the install path, the
install command, and the way that client confirms a new skill. Use it when it
applies to you.

| Client | Prompt |
|---|---|
| Claude Code | `prompts/install-claude-code.md` |
| Codex | `prompts/install-codex.md` |
| Cursor | `prompts/install-cursor.md` |
| Hermes Agent | `prompts/install-hermes-agent.md` |
| OpenClaw | `prompts/install-openclaw.md` |

If one of those applies, stop and name it. Otherwise continue with this prompt.

## 2. Install the skill

Run this command:

```bash
npx skills add mayarid/skills --skill mayar-v2 --global --yes
```

The `skills` CLI detects the client that runs it and installs to that client's
user skill directory. It supports more than 70 clients. It reads the current
state of `https://github.com/mayarid/skills`. Use only that repository.

Record the exact path that the CLI reports. Sections 3 and 5 need it.

The CLI links each agent directory to one canonical copy. Keep that default. Do
not add `--copy`.

The command replaces an existing installation. Section 3 checks the result.

The CLI sends anonymous installation telemetry. To opt out, put
`DISABLE_TELEMETRY=1` in front of the command.

If the CLI does not recognise your client, use the manual method in the
appendix.

## 3. Check the installed files

Read the frontmatter of `SKILL.md` at the path that Section 2 reported. Confirm
that `name` is `mayar-v2`.

**Stop** if `SKILL.md` is absent, or if `name` is not `mayar-v2`. The
installation failed. Report the exact path and the problem.

The installation follows the `main` branch of `mayarid/skills`. Do not check
`metadata.version`.

## 4. Prove that the client sees the skill

Run this command, and only this command:

```bash
npx skills list
```

Confirm that `mayar-v2` appears for your client. Do not list the directory, do
not run a second listing, and do not add your own checks.

If the skill does not appear in the client, tell me to restart it.

This command proves that the files are in place. It does not prove that the
client loaded them. Only I can confirm that, and Section 5 tells you how to ask.

## 5. Report, then ask what I want to do

Tell me in two plain sentences where you installed the skill and that `SKILL.md`
is present and correct. Do not print a checklist of section numbers.

Then write this line, in your own words:

> Open the skill list in your client and check that `mayar-v2` is there. Tell me
> if it is missing.

That line is required. It is the only proof that the client loaded the skill,
and only I can give it to you. Never write that the client check passed.

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

## Appendix: manual installation

Use this method only when the `skills` CLI cannot reach the network or does not
support your client. Find your client's user skill directory in its own
documentation first. Ask me if you cannot determine it. Do not guess.

```bash
git clone --depth 1 https://github.com/mayarid/skills /tmp/mayar-skills
mkdir -p <client-skills-directory>
rm -rf <client-skills-directory>/mayar-v2
cp -R /tmp/mayar-skills/skills/mayar-v2 <client-skills-directory>/mayar-v2
rm -rf /tmp/mayar-skills
```

Then continue at Section 3. Section 4 does not apply, because the CLI did not
perform the installation. The file check in Section 3 is the only machine check
in that case.
