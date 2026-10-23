#!/usr/bin/env node

'use strict';

/**
 * Validates the golfo-kit agent compatibility report:
 * - the JSON report against its versioned JSON Schema,
 * - the consistency rules (status derivation, evidence, incompatibility IDs,
 *   summary counts, one entry per skill directory),
 * - the Markdown report against the JSON (same skills, statuses and
 *   incompatibility IDs, and identical to the rendering).
 *
 * Usage:
 *   node scripts/validate-compatibility-report.js [--report <json>] [--markdown <md>]
 *     [--schema <json>] [--skills-dir <dir>]
 *
 * Exit codes: 0 valid, 1 violations found, 2 usage or unreadable input.
 */

const fs = require('fs');
const path = require('path');
const { validateSchema } = require('./lib/json-schema-subset');
const { checkConsistency, checkMarkdownSync } = require('./lib/compatibility-report');

const REPOSITORY_ROOT = path.join(__dirname, '..');
const REFERENCES_DIR = path.join(REPOSITORY_ROOT, 'plugins', 'golfo-kit', 'references');
const DEFAULT_PATHS = {
  report: path.join(REFERENCES_DIR, 'compatibility-report.json'),
  markdown: path.join(REFERENCES_DIR, 'compatibility-report.md'),
  schema: path.join(REFERENCES_DIR, 'compatibility-report.schema.json'),
  'skills-dir': path.join(REPOSITORY_ROOT, 'plugins', 'golfo-kit', 'skills'),
};
const EXIT_INVALID = 1;
const EXIT_USAGE = 2;

/**
 * Parses `--name value` flags over the defaults.
 *
 * @param {string[]} args Command-line arguments.
 * @returns {Record<string, string>} Resolved paths by option name.
 */
function parseArguments(args) {
  const options = { ...DEFAULT_PATHS };
  for (let index = 0; index < args.length; index += 2) {
    const optionName = (args[index] || '').replace(/^--/, '');
    if (!(optionName in DEFAULT_PATHS) || !args[index].startsWith('--') || args[index + 1] === undefined) {
      throw new Error(`invalid argument '${args[index]}'; expected --report, --markdown, --schema or --skills-dir followed by a path`);
    }
    options[optionName] = path.resolve(args[index + 1]);
  }
  return options;
}

/**
 * Reads and parses a JSON file, naming the file on failure.
 *
 * @param {string} filePath JSON file path.
 * @returns {unknown} Parsed JSON.
 */
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`could not read JSON ${filePath}: ${error.message}`, { cause: error });
  }
}

function main() {
  let options;
  let report;
  let schema;
  let markdown;
  let skillIdsOnDisk;
  try {
    options = parseArguments(process.argv.slice(2));
    schema = readJson(options.schema);
    report = readJson(options.report);
    markdown = fs.readFileSync(options.markdown, 'utf8');
    skillIdsOnDisk = fs.readdirSync(options['skills-dir'], { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(options['skills-dir'], entry.name, 'SKILL.md')))
      .map((entry) => entry.name);
  } catch (error) {
    console.error(`validate-compatibility-report: ${error.message}`);
    process.exit(EXIT_USAGE);
  }

  const schemaErrors = validateSchema(schema, report).map((message) => `schema ${message}`);
  // Consistency rules assume the shape the schema guarantees.
  const errors = schemaErrors.length
    ? schemaErrors
    : [...checkConsistency(report, { skillIdsOnDisk }), ...checkMarkdownSync(report, markdown)];
  if (errors.length) {
    console.error(`Compatibility report is invalid (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
    for (const message of errors) console.error(`  - ${message}`);
    process.exit(EXIT_INVALID);
  }
  console.log(`Compatibility report is valid: ${report.skills.length} skills, schema ${report.schema_version}, Markdown in sync.`);
}

main();
