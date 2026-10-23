#!/usr/bin/env bats

# Each test mutates a copy of the committed report with a small Node snippet,
# re-renders the Markdown when the test is about JSON rules, and checks that
# the validator accepts or rejects it for the expected reason.

setup() {
  repository_root="$(cd "$BATS_TEST_DIRNAME/.." && pwd)"
  references_dir="$repository_root/plugins/golfo-kit/references"
  test_root="$(mktemp -d)"
  report="$test_root/report.json"
  markdown="$test_root/report.md"
  cp "$references_dir/compatibility-report.json" "$report"
  cp "$references_dir/compatibility-report.md" "$markdown"
}

teardown() {
  rm -rf "$test_root"
}

validate() {
  run node "$repository_root/scripts/validate-compatibility-report.js" \
    --report "$report" --markdown "$markdown" \
    --schema "$references_dir/compatibility-report.schema.json" \
    --skills-dir "$repository_root/plugins/golfo-kit/skills"
}

# Applies a JavaScript mutation to the report object bound as `report`.
mutate_report() {
  node -e '
    const fs = require("fs");
    const reportPath = process.argv[1];
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const skill = (skillId) => report.skills.find((candidate) => candidate.id === skillId);
    eval(process.argv[2]);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  ' "$report" "$1"
}

render_markdown() {
  node "$repository_root/scripts/render-compatibility-report.js" --report "$report" --markdown "$markdown" >/dev/null
}

@test "accepts the committed report and its Markdown" {
  validate

  [ "$status" -eq 0 ]
  [[ "$output" == *"Compatibility report is valid"* ]]
}

@test "rejects a report that breaks the JSON Schema" {
  mutate_report 'report.schema_version = "2.0.0"; skill("improve-spec").agents.codex.status = "works";'

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"schema /schema_version: expected constant"* ]]
  [[ "$output" == *"/skills/"*"/agents/codex/status"*"is not one of"* ]]
}

@test "rejects a skill status that its features do not derive" {
  mutate_report 'skill("create-issue").agents.hermes.status = "compatible";'
  render_markdown

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"skill create-issue / hermes: status is compatible but its features derive unverified"* ]]
}

@test "rejects an enabled feature without an execution test in that agent" {
  mutate_report '
    const compatibility = skill("create-issue").agents.codex;
    Object.assign(compatibility.features[0], { status: "enabled" });
    compatibility.status = "compatible";
    report.summary.by_agent.codex.unverified -= 1;
    report.summary.by_agent.codex.compatible += 1;
  '
  render_markdown

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"enabled requires a passed eval or real_run test executed in codex"* ]]
}

@test "does not accept a simulated eval as evidence for another agent" {
  mutate_report '
    const loop = skill("codex-autofix-loop");
    const feature = loop.agents.codex.features.find((candidate) => candidate.id === "merge-gates");
    feature.status = "enabled";
  '
  render_markdown

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"codex-autofix-loop / codex / merge-gates: enabled requires a passed eval or real_run test executed in codex"* ]]
}

@test "rejects a disabled feature without its incompatibility entry" {
  mutate_report 'skill("review-fix-loop").issues = skill("review-fix-loop").issues.filter((entry) => entry.agent !== "hermes");'
  render_markdown

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"disabled feature needs issue INC-review-fix-loop--hermes--isolated-filter"* ]]
}

@test "rejects summary counts that do not match the skills" {
  mutate_report 'report.summary.disabled_features += 1;'
  render_markdown

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"summary.disabled_features: declared"* ]]
}

@test "rejects a report that misses a skill directory" {
  mutate_report 'report.skills = report.skills.filter((candidate) => candidate.id !== "stacked-pr"); report.summary.total_skills -= 1;'

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"skills: not audited: stacked-pr"* ]]
}

@test "rejects Markdown whose matrix status differs from the JSON" {
  sed -i 's/^| `create-issue` | `unverified` | `unverified` | `unverified` |$/| `create-issue` | `compatible` | `unverified` | `unverified` |/' "$markdown"

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"markdown matrix create-issue: compatible/unverified/unverified but JSON says unverified/unverified/unverified"* ]]
}

@test "rejects Markdown that drops an incompatibility ID" {
  grep -v '^| `INC-widget-ui-proposals--hermes--apply-proposal`' "$markdown" > "$markdown.tmp"
  mv "$markdown.tmp" "$markdown"

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"markdown incompatibility IDs: missing INC-widget-ui-proposals--hermes--apply-proposal"* ]]
}

@test "rejects Markdown edited by hand even when the facts still match" {
  printf '\nNota agregada a mano.\n' >> "$markdown"

  validate

  [ "$status" -eq 1 ]
  [[ "$output" == *"content differs from the JSON rendering; run pnpm compat:render"* ]]
}

@test "exits 2 when an input cannot be read" {
  run node "$repository_root/scripts/validate-compatibility-report.js" --report "$test_root/missing.json"

  [ "$status" -eq 2 ]
  [[ "$output" == *"could not read JSON"* ]]
}
