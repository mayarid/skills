# Install and Integrate Mayar Payments

Install the latest stable official `mayar-v2` Agent Skill, then run its BUILD
workflow for this project. Do not require me to edit this prompt.

## 1. Detect the client

Find the repository root and identify the active coding-agent client from
reliable environment or configuration evidence.

Use its project-local skill path:

| Client | Path |
|---|---|
| Cursor | `.cursor/skills/mayar-v2` |
| Claude Code | `.claude/skills/mayar-v2` |
| Codex | `.agents/skills/mayar-v2` |
| OpenCode | `.opencode/skills/mayar-v2` |
| Gemini CLI | `.gemini/skills/mayar-v2` |
| VS Code or GitHub Copilot | `.github/skills/mayar-v2` |

If the client is not listed, read its official documentation or local
configuration. Ask me if the path remains unknown. Do not guess.

## 2. Install the official release

Use only `https://github.com/mayarid/skills`.

1. If `mayar-v2` is already installed, verify its `SKILL.md`,
   `metadata.version`, and bundled files. Keep a valid version `2.0.0` or later.
   If validation passes, skip Sections 2 and 3 and continue to Section 4.
   For an older or invalid installation, explain the problem and ask before
   replacement. After approval, keep it in place until the staged copy passes
   validation. Stop if replacement is not approved.
2. Resolve the latest GitHub release from
   `https://api.github.com/repos/mayarid/skills/releases/latest`.
3. Require owner `mayarid`, repository `skills`, and a stable semantic-version
   tag. Stop if the release is a draft, prerelease, or cannot be verified.
4. Download that exact tag to a temporary directory. Never use an unpinned
   branch, fork, mirror, or user-provided archive.
5. Use available tools. If a required system tool is missing, show the exact
   installation command and ask before running it.
6. Stage only `skills/mayar-v2` next to the target path. Do not overwrite a
   valid installation directly.

## 3. Validate the installation

Verify that the staged skill contains `SKILL.md`, `playbook/`, `references/`,
and `scripts/validate.mjs`. Require:

- `name: mayar-v2`
- `metadata.version` equal to the resolved release tag without `v`
- All local file references in the Markdown files resolve.

If Node.js is available, run the validator at `scripts/validate.mjs` inside the
staged skill. The script is independent of the current working directory.
Otherwise, verify the frontmatter and expected files manually. Do not install
Node.js only for this check.

After validation passes, move an existing target to a timestamped backup. Then
move the staged directory to the target. Restore the backup if replacement
fails. Stop and report the exact error when any check fails.

## 4. Run the skill

Use the client's native skill refresh or activation when available. If the
client cannot activate a new skill in this session, read the installed
`SKILL.md` directly.

Run its **BUILD** branch for this project. Follow all phase gates and referenced
files exactly. The skill owns project discovery, user decisions, API research,
planning, implementation, security, verification, and handoff.

Report the installed path, release tag, validation result, and the current BUILD
phase.
