'use strict';

/**
 * Shared helpers for plugin provider manifests, used by `create-version` and
 * `check-version-bump`.
 */

const fs = require('fs');
const path = require('path');

const CLAUDE_MANIFEST = path.join('.claude-plugin', 'plugin.json');
const CODEX_MANIFEST = path.join('.codex-plugin', 'plugin.json');
/** Optional Agent Plugins v1 manifest at the plugin root, used by Hermes and other portable runtimes. */
const PORTABLE_MANIFEST = 'plugin.json';
const AGENT_PLUGINS_SCHEMA_V1 = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
/** Top-level fields the Agent Plugins v1 spec defines; runtimes drop any other field. */
const PORTABLE_MANIFEST_FIELDS = new Set([
  '$schema',
  'name',
  'version',
  'description',
  'author',
  'homepage',
  'repository',
  'license',
  'keywords',
  'extensions',
]);
const PORTABLE_PLUGIN_NAME_PATTERN = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const SKILL_NAME_PATTERN = /^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKILL_NAME_MAX_CHARACTERS = 64;
const SKILL_DESCRIPTION_MAX_CHARACTERS = 1024;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

/**
 * Reads the raw text and parsed `version` of a manifest file.
 *
 * @param {string} manifestPath Absolute path to a plugin.json file.
 * @returns {{ raw: string, version: string }} Raw file contents and its version.
 */
function readManifest(manifestPath) {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (typeof parsed.version !== 'string') {
    throw new Error(`Missing "version" field in ${manifestPath}`);
  }
  return { raw, version: parsed.version };
}

/**
 * Discovers plugins that expose both Claude and Codex manifests.
 *
 * @param {string} pluginsDirectory Absolute path to the `plugins/` directory.
 * @returns {Array<{ name: string, rootPath: string, claudePath: string, codexPath: string, portablePath: string | null }>} Discovered plugins.
 */
function discoverPlugins(pluginsDirectory) {
  if (!fs.existsSync(pluginsDirectory)) {
    throw new Error(`Plugins directory not found: ${pluginsDirectory}`);
  }

  return fs
    .readdirSync(pluginsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const pluginRoot = path.join(pluginsDirectory, entry.name);
      const portablePath = path.join(pluginRoot, PORTABLE_MANIFEST);
      return {
        name: entry.name,
        rootPath: pluginRoot,
        claudePath: path.join(pluginRoot, CLAUDE_MANIFEST),
        codexPath: path.join(pluginRoot, CODEX_MANIFEST),
        portablePath: fs.existsSync(portablePath) ? portablePath : null,
      };
    })
    .filter((plugin) => fs.existsSync(plugin.claudePath) && fs.existsSync(plugin.codexPath));
}

/**
 * Lists every manifest whose version must stay in sync: Claude, Codex and,
 * when present, the portable root manifest.
 *
 * @param {{ claudePath: string, codexPath: string, portablePath: string | null }} plugin Plugin descriptor.
 * @returns {string[]} Absolute manifest paths, Claude first.
 */
function listVersionedManifests(plugin) {
  return [plugin.claudePath, plugin.codexPath, plugin.portablePath].filter(Boolean);
}

/**
 * Compares two MAJOR.MINOR.PATCH versions.
 *
 * @param {string} leftVersion First semver string.
 * @param {string} rightVersion Second semver string.
 * @returns {number} Negative when left < right, zero when equal, positive when left > right.
 */
function compareVersions(leftVersion, rightVersion) {
  const leftParts = leftVersion.split('.').map(Number);
  const rightParts = rightVersion.split('.').map(Number);
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
}

module.exports = {
  AGENT_PLUGINS_SCHEMA_V1,
  CLAUDE_MANIFEST,
  CODEX_MANIFEST,
  SEMVER_PATTERN,
  compareVersions,
  PORTABLE_MANIFEST,
  PORTABLE_MANIFEST_FIELDS,
  PORTABLE_PLUGIN_NAME_PATTERN,
  SKILL_DESCRIPTION_MAX_CHARACTERS,
  SKILL_NAME_MAX_CHARACTERS,
  SKILL_NAME_PATTERN,
  discoverPlugins,
  listVersionedManifests,
  readManifest,
};
