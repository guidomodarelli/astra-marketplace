/**
 * Policy of `nextjs-route-ui-boundaries`: the skill decides the route
 * structure (segments, layouts, templates, route groups, parallel routes),
 * the boundaries of each navigation state (loading, error, not-found,
 * Suspense, skeletons) and the server/client split of what a route renders.
 *
 * Those decisions depend on files the unit does not import: the layouts the
 * route renders inside, the boundaries it inherits and the project
 * configuration. `contextEntries` adds them to the unit's closure, so a
 * shared layout invalidates every route under it and a handler of one route
 * invalidates nothing else. Classification is conservative: only moves
 * outside the route tree, copy members, styles that no skeleton or loading
 * boundary uses and translation catalogs leave coverage current; a route
 * file moved to another segment is relevant even with identical content.
 */
import path from 'node:path';

import { splitInputKey } from '../impact/input-diff.mjs';
import { dependencyChain } from '../impact/unit-inputs.mjs';
import { isRouteConventionFile, routeContextFiles } from '../source/next-route-tree.mjs';
import { describeInputKey, increasedSignals } from './base-policy.mjs';
import { isPresentationMember } from './presentation-members.mjs';

const NO_BOUNDARY_FILE_PATTERN = /\.(?:po|pot|md)$/;
const STYLE_FILE_PATTERN = /\.(?:s?css|sass|less)$/;
const PROJECT_FILE_PATTERN = /^(?:next\.config\.[cm]?[jt]s|(?:src\/)?(?:middleware|proxy)\.[jt]s)$/;
const APP_DIRECTORIES = ['app', 'src/app'];

/** Names that mark code or styles as the UI shown while a segment loads. */
const LOADING_UI_PATTERN = /skeleton|fallback|loading|placeholder|shimmer/i;

/** Packages whose version decides which App Router APIs and conventions exist. */
const FRAMEWORK_PACKAGES = new Set(['next', 'react', 'react-dom']);

/** Load signals that add awaited work to the render path of a route. */
const RENDER_WAIT_SIGNALS = new Set(['awaits', 'awaitInLoop', 'fetch', 'database', 'projectCalls']);

/** Prefix of the parent labels a dependency chain ends with (`entry:` or `context:`). */
const CHAIN_ROOT_PREFIX_PATTERN = /^(?:entry|context):/;

/**
 * @param {string | null} filePath
 * @returns {boolean} Whether the file is a page, route handler, layout or boundary of the App Router.
 */
function isRouteFile(filePath) {
  return Boolean(filePath) && APP_DIRECTORIES.some((appDirectory) => isRouteConventionFile(appDirectory, filePath));
}

/**
 * Whether a style input is reached through a skeleton, a fallback or a
 * loading boundary, so it shapes what a navigation shows while it waits.
 *
 * @param {string} key Style input key (`path#*`).
 * @param {Record<string, string>} via Parent of each current input.
 * @returns {boolean}
 */
function stylesLoadingUi(key, via) {
  return dependencyChain(via, key).some((element) => {
    const { part, path: filePath } = splitInputKey(element.replace(CHAIN_ROOT_PREFIX_PATTERN, ''));
    return LOADING_UI_PATTERN.test(path.posix.basename(filePath ?? '')) || LOADING_UI_PATTERN.test(part);
  });
}

/**
 * @param {{ key: string, change: string }} change
 * @param {Record<string, any>} previousSignals
 * @param {Record<string, any>} currentSignals
 * @returns {string[]} Increases of the signals that make a route wait, described.
 */
function addedRenderWaits(change, previousSignals, currentSignals) {
  const previous = change.change === 'added' ? {} : previousSignals[change.key];
  const waits = (signals = {}) => Object.fromEntries(Object.entries(signals).filter(([name]) => RENDER_WAIT_SIGNALS.has(name)));
  return increasedSignals(waits(previous), waits(currentSignals[change.key]));
}

/**
 * @param {{ key: string, change: string }} change
 * @returns {string} What the next run must look at for this change.
 */
function reviewFocus(change) {
  const { part, path: filePath } = splitInputKey(change.key);
  if (change.change === 'relocated') return 'the segment the file now belongs to: URL, layouts it renders inside, loading and error boundaries it inherits or replaces';
  if (change.change === 'removed') return 'what the route lost: a layout, a boundary, a Suspense fallback or a client island; check that each state still has its boundary';
  if (change.key.startsWith('pkg:')) {
    const name = change.key.slice(4);
    return FRAMEWORK_PACKAGES.has(name)
      ? 'App Router APIs and conventions used by the route against the installed version (installed docs in node_modules/next/dist/docs/)'
      : 'whether what the route imports from this package runs on the server or needs a client island';
  }
  if (change.key.startsWith('unresolved:')) return 'import that cannot be resolved: review the file that imports it as a whole';
  if (filePath && PROJECT_FILE_PATTERN.test(filePath)) return 'rendering, caching and navigation options that apply to every route (cacheComponents, partial prefetching, redirects, middleware or proxy matchers)';
  if (filePath && STYLE_FILE_PATTERN.test(filePath)) return 'skeleton that uses these styles: final shape, reserved heights and reduced motion';
  if (part === '<module>') return 'where the server/client boundary falls ("use client", "use server") and what the client bundle imports through it';
  if (isRouteFile(filePath)) return 'segment decisions of this file: layout chrome, Suspense, loading and error boundaries, route segment config and the data it awaits';
  if (part.includes('/')) return 'this handler: client leaf, Next.js navigation (Link, Form, router), server action calls and revalidation';
  if (part.endsWith('~shell')) return 'what this component renders: hooks that force a client island, awaited data, Suspense and the client components it imports';
  if (part.includes('.')) return 'route configuration read from this member, in every segment that uses it';
  return 'server/client split and awaited work of this code in every route of the unit';
}

export const nextjsRouteUiBoundariesPolicy = {
  definitionFiles: ['SKILL.md', 'references/**/*.md'],
  label: 'Next.js',
  // Route context (layouts, boundaries, configuration) is followed two hops:
  // the chrome or skeleton components it renders and their styles or leaves.
  maxDepthByRole: { contract: Infinity, route: 2, server: 1, ui: Infinity },
  modes: ['lightweight', 'incremental', 'full'],
  skill: 'nextjs-route-ui-boundaries',
  tracksLoadSignals: true,

  /** @param {string} filePath */
  excludesFile: (filePath) => NO_BOUNDARY_FILE_PATTERN.test(filePath),

  /**
   * Pages of the unit's routes (their own parts only), every segment file
   * that wraps them and the project configuration, followed with the
   * `route` role.
   *
   * @param {{ index: any, unit: any }} input
   * @returns {{ path: string, symbol: string, role: string, follow: boolean }[]}
   */
  contextEntries({ index, unit }) {
    const { pages, projectFiles, segmentFiles } = routeContextFiles(index, unit);
    return [
      ...pages.map((filePath) => ({ follow: false, path: filePath, role: 'route', symbol: '*' })),
      ...[...segmentFiles, ...projectFiles].map((filePath) => ({ follow: true, path: filePath, role: 'route', symbol: '*' })),
    ];
  },

  /**
   * @param {{ key: string, change: string, from?: string }} change
   * @param {{ previousSignals?: Record<string, any>, currentSignals?: Record<string, any>, currentVia?: Record<string, string> }} context
   * @returns {{ relevant: boolean, reason: string }}
   */
  classifyChange(change, { previousSignals = {}, currentSignals = {}, currentVia = {} }) {
    const { part, path: filePath } = splitInputKey(change.key);
    if (change.change === 'relocated') {
      const fromPath = splitInputKey(change.from).path;
      const segmentChanged = path.posix.dirname(fromPath ?? '') !== path.posix.dirname(filePath ?? '');
      if (segmentChanged && (isRouteFile(filePath) || isRouteFile(fromPath))) return { reason: 'route file moved to another segment: its URL, layouts and inherited boundaries may have changed', relevant: true };
      return { reason: 'moved without changes outside the route tree', relevant: false };
    }
    if (change.change === 'removed') return { reason: 'code no longer reached by the route: a layout, boundary or client island may have been removed', relevant: true };
    if (change.key.startsWith('pkg:')) {
      const name = change.key.slice(4);
      if (FRAMEWORK_PACKAGES.has(name)) return { reason: `framework package ${change.change === 'added' ? 'added' : 'version changed'} (${name}): App Router APIs may differ`, relevant: true };
      return { reason: change.change === 'added' ? 'new package in the route: it may need a client island' : 'package version changed: its server or client requirements may differ', relevant: true };
    }
    if (change.key.startsWith('unresolved:')) return { reason: 'import that cannot be resolved: boundary impact unknown, reviewed conservatively', relevant: true };
    if (filePath && PROJECT_FILE_PATTERN.test(filePath)) return { reason: 'project configuration of rendering, caching or navigation changed: applies to every route', relevant: true };
    if (filePath && STYLE_FILE_PATTERN.test(filePath)) {
      if (stylesLoadingUi(change.key, currentVia)) return { reason: 'styles of a skeleton or loading boundary changed', relevant: true };
      return { reason: 'styles outside skeletons and loading boundaries: no route boundary or server/client decision depends on them', relevant: false };
    }
    const member = part.includes('.') && !part.includes('/') ? part.slice(part.indexOf('.') + 1) : undefined;
    const hasSignals = Boolean(currentSignals[change.key] || previousSignals[change.key]);
    if (member !== undefined && !isRouteFile(filePath)) {
      if (!hasSignals && isPresentationMember(part.slice(0, part.indexOf('.')), member)) return { reason: 'copy or display member: no route boundary depends on it', relevant: false };
      return { reason: 'object member read by the route changed: route configuration impact unknown', relevant: true };
    }
    if (part === '<module>') return { reason: 'module directives ("use client", "use server") or side-effect imports changed', relevant: true };
    const waits = part.includes('/') ? [] : addedRenderWaits(change, previousSignals, currentSignals);
    if (waits.length) return { reason: `adds awaited work to the render path (${waits.join(', ')}): navigation may wait without a loading boundary`, relevant: true };
    if (isRouteFile(filePath)) return { reason: change.change === 'added' ? 'new route file: segment, layout or boundary added' : 'route file changed: segment layout, boundary or page', relevant: true };
    if (part === '*') return { reason: 'file tracked as a whole: boundary impact cannot be classified', relevant: true };
    if (part.includes('/')) return { reason: change.change === 'added' ? 'new interactive handler in the route' : 'interactive handler changed: navigation or server action calls may differ', relevant: true };
    if (part.endsWith('~shell')) return { reason: 'component render changed: hooks, Suspense or client imports may differ', relevant: true };
    return { reason: change.change === 'added' ? 'new code rendered by the route' : 'code rendered by the route changed', relevant: true };
  },

  /**
   * Lightweight runs need a review and a build, lint, typecheck or test run;
   * incremental and full runs also need the navigation states exercised in a
   * browser or by a test.
   *
   * @param {string} mode
   * @returns {string[][]}
   */
  evidenceRequirements(mode) {
    if (mode === 'lightweight') return [['review'], ['command', 'test']];
    return [['review'], ['command'], ['browser', 'test']];
  },

  /**
   * A build, lint or typecheck accredits only when the tool ran it.
   *
   * @param {any} item
   * @returns {string[]}
   */
  validateEvidence(item) {
    if (item.kind !== 'command' || item.outcome === 'fail' || item.source === 'witnessed') return [];
    return ['command evidence (build, lint or typecheck) must be run with evidence --exec, not declared'];
  },

  /**
   * @param {string} decision
   * @param {{ key: string, change: string }[]} relevantChanges
   * @param {{ unit: any }} context
   * @returns {string[]}
   */
  suggestScope(decision, relevantChanges, { unit }) {
    if (decision === 'full') {
      const routes = unit.routes?.length ? ` (${unit.routes.join(', ')})` : '';
      return [`whole unit ${unit.id}${routes}: map the segments that wrap it (layouts, templates, loading, error, not-found), decide the server/client split of each element and the skeleton of each loading state, check the Next.js APIs against the installed version, and verify build, sibling navigation, error containment with retry and the server-rendered shell`];
    }
    return relevantChanges.map((change) => `${describeInputKey(change.key)} — ${reviewFocus(change)}`);
  },
};
