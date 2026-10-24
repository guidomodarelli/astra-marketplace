/**
 * Building blocks shared by skill policies. A policy tells the common engine
 * what a skill considers relevant, which evidence accredits each execution
 * mode and how to scope the next run; the engine never hardcodes a skill.
 *
 * Policy contract:
 * - `skill`, `label`: skill name and short report label.
 * - `definitionFiles`: globs, relative to the skill directory, whose content
 *   is the normative definition hashed into every record.
 * - `modes`: execution modes the skill supports.
 * - `maxDepthByRole`: cross-file hops followed from each entry role.
 * - `excludesFile(path)`: files outside the skill's concern.
 * - `tracksLoadSignals`: whether part load signals are stored.
 * - `classifyChange(change, context)`: `{ relevant, reason }`.
 * - `evidenceRequirements(mode)`: groups of evidence kinds; each group needs
 *   one passing item.
 * - `validateEvidence(evidence)`: extra checks of one evidence item.
 * - `suggestScope(decision, relevantChanges, context)`: next run's scope.
 * - `contextEntries({ unit, index, config })` (optional): extra entries the
 *   unit's closure needs for this skill and that the unit does not declare,
 *   such as the layouts and boundaries wrapping its routes. Each entry is
 *   `{ path, symbol, role, follow }` and must name an existing file.
 *
 * `classifyChange` receives `previousSignals`, `currentSignals`,
 * `signalsRecorded` and `currentVia` (the parent of each current input, for
 * `dependencyChain`).
 */
import { splitInputKey } from '../impact/input-diff.mjs';

/**
 * Turns an input key into a short human description.
 *
 * @param {string} key
 * @returns {string}
 */
export function describeInputKey(key) {
  if (key.startsWith('pkg:')) return `package ${key.slice(4)}`;
  if (key.startsWith('unresolved:')) return `unresolved import ${key.slice(11)}`;
  const { path, part } = splitInputKey(key);
  if (part === '*') return `${path} (whole file)`;
  if (part === '<module>') return `${path} (module directives and side effects)`;
  if (part.endsWith('~shell')) return `${path} › ${part.slice(0, -6)} (component body outside its handlers)`;
  if (part.endsWith('~frame')) return `${path} › ${part.slice(0, -6)} (object structure)`;
  return `${path} › ${part.replace('/', ' › ')}`;
}

/** Human description of each load signal the module analyzer counts. */
const SIGNAL_LABELS = {
  awaitInLoop: 'awaited calls inside a loop',
  awaits: 'awaited steps',
  database: 'database queries',
  dynamicImports: 'dynamic imports',
  effects: 'effects',
  fetch: 'requests',
  listeners: 'listeners or subscriptions',
  projectCalls: 'calls to I/O helpers',
  timers: 'timers or polling',
};

/**
 * @param {Record<string, number> | undefined} previous
 * @param {Record<string, number> | undefined} current
 * @returns {string[]} Increased signals, described.
 */
export function increasedSignals(previous = {}, current = {}) {
  return Object.entries(current)
    .filter(([name, count]) => count > (previous[name] ?? 0))
    .map(([name, count]) => `+${count - (previous[name] ?? 0)} ${SIGNAL_LABELS[name] ?? name}`);
}

/**
 * Checks evidence against requirement groups.
 *
 * @param {any[]} evidence Evidence items of a run.
 * @param {string[][]} groups Each group lists kinds; one passing item per group is required.
 * @param {(item: any) => string[]} validateItem Extra validation per item.
 * @returns {string[]} Missing or invalid evidence descriptions; empty when accredited.
 */
export function missingEvidence(evidence, groups, validateItem) {
  const problems = [];
  const failing = evidence.filter((item) => item.outcome === 'fail');
  for (const item of failing) problems.push(`${item.kind} evidence failed: ${item.summary || item.command || 'no summary'}`);
  for (const item of evidence) for (const problem of validateItem(item)) problems.push(problem);
  for (const group of groups) {
    const satisfied = evidence.some((item) => group.includes(item.kind) && ['pass', 'measured'].includes(item.outcome) && validateItem(item).length === 0);
    if (!satisfied) problems.push(`missing passing evidence of kind ${group.join(' or ')}`);
  }
  return problems;
}
