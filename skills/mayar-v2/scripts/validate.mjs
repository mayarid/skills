#!/usr/bin/env node

import {
  access,
  readdir,
  readFile,
} from "node:fs/promises";
import { constants } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(scriptDir, "..");

const expectedFiles = [
  "SKILL.md",
  "playbook/discover.md",
  "playbook/plan.md",
  "playbook/implement.md",
  "playbook/verify.md",
  "references/api-sources.md",
  "references/cli-commands.md",
  "references/webhook-safety.md",
  "references/stack-pattern.md",
  "references/stack-nextjs.md",
  "references/stack-tanstack-start.md",
  "references/stack-vite-react.md",
  "scripts/validate.mjs",
];

const removedPaths = [
  "commands.md",
  "recipes/_pattern.md",
  "recipes/nextjs.md",
  "recipes/tanstack-start.md",
  "recipes/vite-react.md",
];

const forbiddenMarkdown = [
  { label: "legacy sandbox domain", pattern: /mayar\.club/i },
  { label: "dashboard session-cookie workaround", pattern: /connect\.sid/i },
  { label: "in-memory webhook dedupe", pattern: /new\s+Set\s*</i },
  {
    label: "legacy credit endpoint",
    pattern: /\/customers\/\{customerId\}\/credits/i,
  },
  {
    label: "legacy credit registration endpoint",
    pattern: /\/customers\/register-credit-usage/i,
  },
];

const indonesianProsePattern =
  /\b(?:adalah|atau|baca|belum|berhasil|dan|dengan|gunakan|halaman|hanya|harus|jangan|jika|jalankan|kegagalan|kebutuhan|memakai|menjalankan|menulis|minta|perubahan|pilih|sampai|sebelum|selesai|setelah|simpan|sudah|tanpa|tanya|untuk|yang)\b/i;

function printHelp() {
  console.log(`Usage: node scripts/validate.mjs

Validate the Mayar skill structure and local content.

Exit codes:
  0  Validation passed
  1  Skill validation failed
  2  Invalid command usage

The script is cwd-independent and accepts no options other than --help.`);
}

function failUsage(message) {
  console.error(`Error: ${message}`);
  console.error("Run with --help for usage.");
  process.exit(2);
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdown(path)));
    } else if (entry.isFile() && extname(entry.name) === ".md") {
      files.push(path);
    }
  }
  return files;
}

function frontmatterBlocks(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) return null;

  const blocks = new Map();
  let currentKey = null;
  for (const line of match[1].split("\n")) {
    const keyMatch = line.match(/^([a-z][a-z0-9-]*):(?:\s*(.*))?$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      blocks.set(currentKey, keyMatch[2] ?? "");
    } else if (currentKey && /^\s+/.test(line)) {
      blocks.set(
        currentKey,
        `${blocks.get(currentKey)}\n${line.trim()}`,
      );
    }
  }
  return blocks;
}

function normalizedBlock(value) {
  return value
    .replace(/^[>|]\s*\n?/, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/^["']|["']$/g, "");
}

function validateFrontmatter(source, errors) {
  const blocks = frontmatterBlocks(source);
  if (!blocks) {
    errors.push("SKILL.md: missing YAML frontmatter");
    return;
  }

  const allowed = new Set([
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
  ]);
  for (const key of blocks.keys()) {
    if (!allowed.has(key)) {
      errors.push(`SKILL.md: non-standard top-level field "${key}"`);
    }
  }

  const name = normalizedBlock(blocks.get("name") ?? "");
  if (name !== basename(skillRoot)) {
    errors.push(
      `SKILL.md: name must equal directory "${basename(skillRoot)}", received "${name}"`,
    );
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    errors.push("SKILL.md: name violates Agent Skills naming constraints");
  }

  const description = normalizedBlock(blocks.get("description") ?? "");
  if (description.length < 1 || description.length > 1024) {
    errors.push(
      `SKILL.md: description must be 1-1024 characters, received ${description.length}`,
    );
  }
  if (!/^use this skill when\b/i.test(description)) {
    errors.push('SKILL.md: description must start with "Use this skill when"');
  }

  const metadata = blocks.get("metadata") ?? "";
  if (!/\bversion:\s*["']2\.0\.0["']/.test(metadata)) {
    errors.push('SKILL.md: metadata.version must be "2.0.0"');
  }
}

function validateFences(path, source, errors) {
  const fences = source
    .split("\n")
    .filter((line) => /^```/.test(line.trim())).length;
  if (fences % 2 !== 0) {
    errors.push(`${path}: unbalanced Markdown fences (${fences})`);
  }
}

function validateEnglishProse(path, source, errors) {
  const prose = source
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/\[([^\]]*)]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "");
  const match = prose.match(indonesianProsePattern);
  if (match) {
    errors.push(
      `${path}: contains Indonesian prose term "${match[0]}"`,
    );
  }
}

async function validateLinks(path, source, errors) {
  const linkPattern = /\[[^\]]*]\(([^)]+)\)/g;
  for (const match of source.matchAll(linkPattern)) {
    const target = match[1].trim().split("#")[0];
    if (
      !target ||
      /^(?:https?:|mailto:|#)/i.test(target) ||
      target.includes("://")
    ) {
      continue;
    }
    const absoluteTarget = resolve(dirname(path), decodeURIComponent(target));
    if (!(await exists(absoluteTarget))) {
      errors.push(
        `${path}: broken relative link "${target}"`,
      );
    }
  }
}

async function validate() {
  const errors = [];

  for (const relativePath of expectedFiles) {
    if (!(await exists(join(skillRoot, relativePath)))) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }
  for (const relativePath of removedPaths) {
    if (await exists(join(skillRoot, relativePath))) {
      errors.push(`Removed path still exists: ${relativePath}`);
    }
  }

  const skillPath = join(skillRoot, "SKILL.md");
  if (await exists(skillPath)) {
    const skillSource = await readFile(skillPath, "utf8");
    validateFrontmatter(skillSource, errors);
    const lines = skillSource.trimEnd().split("\n").length;
    if (lines > 80) {
      errors.push(`SKILL.md: router exceeds 80 lines (${lines})`);
    }

    const requiredPointers = [
      "playbook/discover.md",
      "playbook/plan.md",
      "playbook/implement.md",
      "playbook/verify.md",
      "references/cli-commands.md",
    ];
    for (const pointer of requiredPointers) {
      if (!skillSource.includes(pointer)) {
        errors.push(`SKILL.md: missing router pointer "${pointer}"`);
      }
    }
  }

  for (const path of await collectMarkdown(skillRoot)) {
    const source = await readFile(path, "utf8");
    const relativePath = path.slice(skillRoot.length + 1);
    validateFences(relativePath, source, errors);
    validateEnglishProse(relativePath, source, errors);
    await validateLinks(path, source, errors);
    for (const forbidden of forbiddenMarkdown) {
      if (forbidden.pattern.test(source)) {
        errors.push(`${relativePath}: contains ${forbidden.label}`);
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`Error: ${error}`);
    console.log(
      JSON.stringify({ ok: false, errors: errors.length, skillRoot }),
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      ok: true,
      checkedFiles: expectedFiles.length,
      skillRoot,
    }),
  );
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  if (args.length > 1) failUsage("--help cannot be combined with other options");
  printHelp();
  process.exit(0);
}
if (args.length > 0) failUsage(`unknown argument "${args[0]}"`);

await validate();
