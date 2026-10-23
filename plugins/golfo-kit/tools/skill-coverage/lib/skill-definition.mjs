/**
 * Identity of a skill's normative definition: version from the SKILL.md
 * frontmatter and a hash of the files the policy declares (SKILL.md and its
 * references). The frontmatter `version` line is excluded from the hash, so
 * a bump without content changes does not invalidate coverage, while any
 * change to the rules does.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { entryHash, globToRegExp, normalizeLineEndings, sha256 } from './support.mjs';

/** Environment variable pointing to a directory that contains the skills (one folder per skill). */
export const SKILLS_DIRECTORY_ENVIRONMENT_VARIABLE = 'GOLFO_COVERAGE_SKILLS_DIR';

const DEFAULT_SKILLS_DIRECTORY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../skills');

/**
 * @param {string} skill
 * @param {string} [skillsDirectory]
 * @returns {string} Absolute skill directory.
 */
export function skillDirectory(skill, skillsDirectory) {
  return path.join(skillsDirectory ?? process.env[SKILLS_DIRECTORY_ENVIRONMENT_VARIABLE] ?? DEFAULT_SKILLS_DIRECTORY, skill);
}

/**
 * @typedef {{ name: string, version: string | null, hash: string | null, files: Record<string, string>, available: boolean }} SkillDefinition
 */

/**
 * Reads the definition of a skill.
 *
 * @param {any} policy
 * @param {{ skillsDirectory?: string }} [options]
 * @returns {SkillDefinition} `available: false` when the skill files are not installed here.
 */
export function readSkillDefinition(policy, options = {}) {
  const directory = skillDirectory(policy.skill, options.skillsDirectory);
  const skillFile = path.join(directory, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return { available: false, files: {}, hash: null, name: policy.skill, version: null };
  const patterns = policy.definitionFiles.map(globToRegExp);
  const relativeFiles = fs.readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(directory, path.join(entry.parentPath ?? entry.path, entry.name)).split(path.sep).join('/'))
    .filter((relativePath) => patterns.some((pattern) => pattern.test(relativePath)))
    .sort();
  const files = {};
  let version = null;
  for (const relativePath of relativeFiles) {
    let content = normalizeLineEndings(fs.readFileSync(path.join(directory, relativePath), 'utf8'));
    if (relativePath === 'SKILL.md') {
      version = /^\s*version:\s*["']?([^"'\n]+)["']?\s*$/m.exec(content)?.[1] ?? null;
      content = content.replace(/^\s*version:.*$/m, '');
    }
    files[relativePath] = entryHash(content);
  }
  const hash = `sha256:${sha256(Object.entries(files).map(([file, fileHash]) => `${file}=${fileHash}`).join('\n'))}`;
  return { available: true, files, hash, name: policy.skill, version };
}
