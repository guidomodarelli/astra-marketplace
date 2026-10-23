/**
 * Decides, before a skill runs on a unit, whether the run can be skipped,
 * reviewed incrementally or must analyze the whole unit. Every decision
 * carries the reasons and the suggested scope; a forced full audit always
 * wins over the cache.
 */
import { DECISIONS, FRESHNESS, FULL_REVIEW_CHANGE_RATIO } from '../constants.mjs';
import { splitInputKey } from '../impact/input-diff.mjs';

/**
 * @param {{ coverage: any, current: any, policy: any, unit: any, forceFull?: boolean }} input
 * @returns {{ decision: string, mode: string | null, reasons: string[], suggestedScope: string[], relevantChanges: any[], ignoredChanges: any[] }}
 */
export function decideExecution({ coverage, current, policy, unit, forceFull = false }) {
  const evaluation = coverage.evaluation;
  const relevantChanges = evaluation?.relevantChanges ?? [];
  const ignoredChanges = evaluation?.ignoredChanges ?? [];
  const scopeContext = { baselineCommit: coverage.attempt?.baseline.commit, history: evaluation?.history, unit };
  const result = (decision, reasons, changesForScope = relevantChanges) => ({
    decision,
    ignoredChanges,
    mode: decision === DECISIONS.full ? 'full' : decision === DECISIONS.incremental ? 'incremental' : null,
    reasons,
    relevantChanges,
    suggestedScope: [DECISIONS.full, DECISIONS.incremental].includes(decision) ? policy.suggestScope(decision, changesForScope, scopeContext) : [],
  });

  if (forceFull) return result(DECISIONS.full, ['full audit requested: previous coverage is not reused']);
  if (coverage.state === 'not-applicable' && !coverage.attempt) return result(DECISIONS.notApplicable, coverage.reasons);
  if (coverage.state === 'unreviewed') return result(DECISIONS.full, ['no previous coverage: the whole unit is analyzed']);

  const attempt = coverage.attempt;
  const reasons = [...coverage.reasons];
  if (evaluation.definitionStatus === 'major-change') return result(DECISIONS.full, [...reasons, 'major version of the skill: previous coverage is not reused']);
  if (evaluation.history === 'unreachable') reasons.push(`baseline commit ${attempt.baseline.commit?.slice(0, 12) ?? '?'} is no longer in history: compared by content fingerprints`);
  else if (evaluation.history === 'diverged') reasons.push('baseline commit is not an ancestor of HEAD (rebase or branch switch): compared by content fingerprints');

  if (attempt.result === 'blocked') return result(DECISIONS.full, [...reasons, `previous run was blocked: ${attempt.limitations.join('; ') || 'no detail'}`]);

  if (coverage.freshness === FRESHNESS.unknown) {
    const fileChanges = evaluation.changedFiles.map((filePath) => ({ change: 'modified', key: `${filePath}#*`, reason: 'file changed; symbol impact unknown' }));
    if (!fileChanges.length && evaluation.definitionStatus !== 'unknown') return result(DECISIONS.full, [...reasons, 'coverage cannot be compared reliably']);
    return result(DECISIONS.incremental, [...reasons, 'coverage cannot be confirmed: reviewing every changed file conservatively'], fileChanges.length ? fileChanges : relevantChanges);
  }

  if (attempt.result === 'not-applicable') {
    if (coverage.freshness === FRESHNESS.current) return result(DECISIONS.notApplicable, [...reasons, `recorded not applicable: ${attempt.summary ?? ''}`.trim()]);
    return result(DECISIONS.incremental, [...reasons, 'relevant changes since the skill was recorded not applicable: re-evaluate applicability']);
  }

  if (attempt.result === 'partial') {
    const pending = attempt.pendingChecks.map((check) => `pending from the previous run: ${check}`);
    return { ...result(DECISIONS.incremental, [...reasons, 'previous run was partial']), suggestedScope: [...pending, ...policy.suggestScope(DECISIONS.incremental, relevantChanges, scopeContext)] };
  }

  if (coverage.freshness === FRESHNESS.current) {
    const ignoredNote = ignoredChanges.length ? [`${ignoredChanges.length} change(s) not relevant to ${policy.skill}`] : [];
    return result(DECISIONS.skip, [...reasons, 'verified coverage is current', ...ignoredNote]);
  }

  // Stale verified coverage.
  if (evaluation.definitionStatus === 'changed' && !relevantChanges.length) {
    return {
      ...result(DECISIONS.incremental, reasons),
      suggestedScope: evaluation.definitionChangedFiles.map((file) => `re-check the unit against the rules changed in ${policy.skill}/${file}`),
    };
  }
  const hasEntryKey = (keys, entry) => {
    const prefix = `${entry.path}#${entry.symbol && entry.symbol !== '*' ? entry.symbol : ''}`;
    return keys.some((key) => key === prefix || key.startsWith(prefix) && !/[\w$]/.test(key[prefix.length] ?? ''));
  };
  const previousKeys = Object.keys(attempt.baseline.inputs);
  const currentKeys = Object.keys(current.inputs);
  const removedEntry = unit.entries.find((entry) => hasEntryKey(previousKeys, entry) && !hasEntryKey(currentKeys, entry));
  if (removedEntry) return result(DECISIONS.full, [...reasons, `entry ${removedEntry.path}#${removedEntry.symbol ?? '*'} no longer exists: update the unit entries and analyze it again`]);
  const totalParts = Object.keys(current.inputs).filter((key) => splitInputKey(key).path !== null).length || 1;
  const changedParts = relevantChanges.filter((change) => splitInputKey(change.key).path !== null).length;
  if (changedParts / totalParts > FULL_REVIEW_CHANGE_RATIO) {
    return result(DECISIONS.full, [...reasons, `${changedParts} of ${totalParts} parts changed: the unit is reviewed as a whole`]);
  }
  return result(DECISIONS.incremental, [...reasons, `${relevantChanges.length} relevant change(s) since the verified run`]);
}
