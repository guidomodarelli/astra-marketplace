'use strict';

/**
 * Shared helpers for plugin provider manifests, used by `create-version` and
 * `check-version-bump`.
 */

const fs = require('fs');
const path = require('path');

const CLAUDE_MANIFEST = path.join('.claude-plugin', 'plugin.json');
const CODEX_MANIFEST = path.join('.codex-plugin', 'plugin.json');
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
 * @returns {Array<{ name: string, rootPath: string, claudePath: string, codexPath: string }>} Discovered plugins.
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
      return {
        name: entry.name,
        rootPath: pluginRoot,
        claudePath: path.join(pluginRoot, CLAUDE_MANIFEST),
        codexPath: path.join(pluginRoot, CODEX_MANIFEST),
      };
    })
    .filter((plugin) => fs.existsSync(plugin.claudePath) && fs.existsSync(plugin.codexPath));
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
  CLAUDE_MANIFEST,
  CODEX_MANIFEST,
  SEMVER_PATTERN,
  compareVersions,
  discoverPlugins,
  readManifest,
};
