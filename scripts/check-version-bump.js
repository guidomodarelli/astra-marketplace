#!/usr/bin/env node

'use strict';

/**
 * Fails when a plugin changed against a base reference without a version bump.
 *
 * A plugin counts as changed when any file under `plugins/<name>/` changed,
 * except files inside `tests/` or `evals/` directories, which do not change
 * what the plugin ships to agents. A changed plugin must:
 * - keep `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` on the same version,
 * - use a MAJOR.MINOR.PATCH version,
 * - raise that version above the one it had at the merge base.
 * New plugins (no manifest at the merge base) only need the first two.
 *
 * Usage:
 *   pnpm check-version-bump [base-ref]   (default: origin/main)
 */

const childProcess = require('child_process');
const path = require('path');
const {
  SEMVER_PATTERN,
  compareVersions,
  discoverPlugins,
  readManifest,
} = require('./lib/plugin-manifests');

const REPOSITORY_ROOT = path.join(__dirname, '..');
const PLUGINS_DIR = path.join(REPOSITORY_ROOT, 'plugins');
const DEFAULT_BASE_REFERENCE = 'origin/main';
/** Directory names whose files never require a version bump. */
const VERSION_NEUTRAL_DIRECTORIES = new Set(['tests', 'evals']);
const BUMP_COMMAND_HINT = 'pnpm create-version';

/**
 * Executes a Git command from the repository root and returns stdout.
 *
 * @param {string[]} args Git command arguments.
 * @returns {string} Command stdout.
 */
function runGit(args) {
  try {
    return childProcess.execFileSync('git', args, {
      cwd: REPOSITORY_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim() : '';
    throw new Error(`check-version-bump: "git ${args.join(' ')}" failed: ${stderr || error.message}`, {
      cause: error,
    });
  }
}

/**
 * Converts an absolute path into the repository-relative, slash-separated form Git expects.
 *
 * @param {string} absolutePath Absolute path inside the repository.
 * @returns {string} Repository-relative path.
 */
function toRepositoryPath(absolutePath) {
  return path.relative(REPOSITORY_ROOT, absolutePath).split(path.sep).join('/');
}

/**
 * Tells whether a changed path inside a plugin affects what the plugin ships.
 *
 * @param {string} pluginRelativePath Path relative to the plugin root.
 * @returns {boolean} True when the change requires a version bump.
 */
function requiresVersionBump(pluginRelativePath) {
  const directories = pluginRelativePath.split('/').slice(0, -1);
  return !directories.some((directory) => VERSION_NEUTRAL_DIRECTORIES.has(directory));
}

/**
 * Reads the Claude manifest version a plugin had at the given commit.
 *
 * @param {string} commit Commit to read from.
 * @param {{ claudePath: string }} plugin Plugin descriptor.
 * @returns {string} Version at that commit, or empty string when the manifest did not exist.
 */
function readVersionAt(commit, plugin) {
  let raw;
  try {
    raw = runGit(['show', `${commit}:${toRepositoryPath(plugin.claudePath)}`]);
  } catch (error) {
    // New plugins have no manifest at the merge base; the merge base itself was already resolved.
    return '';
  }
  const parsed = JSON.parse(raw);
  return typeof parsed.version === 'string' ? parsed.version : '';
}

/**
 * Validates one changed plugin and returns its problems.
 *
 * @param {{ name: string, claudePath: string, codexPath: string }} plugin Plugin descriptor.
 * @param {string} baseCommit Merge-base commit.
 * @returns {{ baseVersion: string, currentVersion: string, problems: string[] }} Validation result.
 */
function validatePlugin(plugin, baseCommit) {
  const currentVersion = readManifest(plugin.claudePath).version;
  const codexVersion = readManifest(plugin.codexPath).version;
  const baseVersion = readVersionAt(baseCommit, plugin);
  const problems = [];

  if (currentVersion !== codexVersion) {
    problems.push(
      `Claude manifest has ${currentVersion} but Codex manifest has ${codexVersion}; keep both on the same version.`
    );
  }
  if (!SEMVER_PATTERN.test(currentVersion)) {
    problems.push(`Version "${currentVersion}" is not MAJOR.MINOR.PATCH.`);
  } else if (baseVersion && SEMVER_PATTERN.test(baseVersion) && compareVersions(currentVersion, baseVersion) <= 0) {
    problems.push(
      `Plugin changed but its version is ${currentVersion} (base ${baseVersion}); bump it with "${BUMP_COMMAND_HINT}".`
    );
  }

  return { baseVersion, currentVersion, problems };
}

function main() {
  const baseReference = process.argv[2] || DEFAULT_BASE_REFERENCE;
  const baseCommit = runGit(['merge-base', baseReference, 'HEAD']).trim();
  const changedPaths = runGit(['diff', '--name-only', baseCommit, 'HEAD']).split('\n').filter(Boolean);
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  let failureCount = 0;

  for (const plugin of discoverPlugins(PLUGINS_DIR)) {
    const pluginPrefix = `${toRepositoryPath(plugin.rootPath)}/`;
    const shippedChanges = changedPaths
      .filter((changedPath) => changedPath.startsWith(pluginPrefix))
      .filter((changedPath) => requiresVersionBump(changedPath.slice(pluginPrefix.length)));

    if (shippedChanges.length === 0) {
      console.log(`- ${plugin.name}: no shipped changes, no bump needed.`);
      continue;
    }

    const { baseVersion, currentVersion, problems } = validatePlugin(plugin, baseCommit);
    if (problems.length === 0) {
      const transition = baseVersion ? `${baseVersion} -> ${currentVersion}` : `new plugin at ${currentVersion}`;
      console.log(`✔ ${plugin.name}: ${transition}.`);
      continue;
    }

    failureCount += problems.length;
    for (const problem of problems) {
      console.error(`✖ ${plugin.name}: ${problem}`);
      if (isGitHubActions) {
        console.log(`::error file=${toRepositoryPath(plugin.claudePath)}::${plugin.name}: ${problem}`);
      }
    }
  }

  if (failureCount > 0) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
