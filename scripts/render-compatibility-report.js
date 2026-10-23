#!/usr/bin/env node

'use strict';

/**
 * Renders plugins/golfo-kit/references/compatibility-report.md from
 * compatibility-report.json, so the Markdown never drifts from the data.
 *
 * Usage:
 *   node scripts/render-compatibility-report.js [--report <json>] [--markdown <md>]
 */

const fs = require('fs');
const path = require('path');
const { renderMarkdown } = require('./lib/compatibility-report');

const REFERENCES_DIR = path.join(__dirname, '..', 'plugins', 'golfo-kit', 'references');
const EXIT_USAGE = 2;

function main() {
  const args = process.argv.slice(2);
  const options = {
    report: path.join(REFERENCES_DIR, 'compatibility-report.json'),
    markdown: path.join(REFERENCES_DIR, 'compatibility-report.md'),
  };
  for (let index = 0; index < args.length; index += 2) {
    const optionName = (args[index] || '').replace(/^--/, '');
    if (!(optionName in options) || args[index + 1] === undefined) {
      console.error(`render-compatibility-report: invalid argument '${args[index]}'; expected --report or --markdown followed by a path`);
      process.exit(EXIT_USAGE);
    }
    options[optionName] = path.resolve(args[index + 1]);
  }
  let report;
  try {
    report = JSON.parse(fs.readFileSync(options.report, 'utf8'));
  } catch (error) {
    console.error(`render-compatibility-report: could not read JSON ${options.report}: ${error.message}`);
    process.exit(EXIT_USAGE);
  }
  fs.writeFileSync(options.markdown, renderMarkdown(report));
  console.log(`Wrote ${options.markdown}`);
}

main();
